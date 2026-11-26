"""Offline policy model, not an OS sandbox or a production authorization service.

Run with Python 3.10 or later. No credentials, packages, network calls, or
infrastructure are used. Identities, approvals, and time are trusted fixtures.
"""

from dataclasses import dataclass, field, replace


@dataclass(frozen=True)
class Action:
    resource: str
    replicas: int


@dataclass(frozen=True)
class Approval:
    principal: str
    action: Action
    resource_version: int
    expires_at: int


@dataclass
class Workload:
    replicas: int
    version: int


class Denied(Exception):
    pass


@dataclass
class Broker:
    workloads: dict[str, Workload]
    permissions: dict[str, frozenset[str]]
    approvals: dict[str, Approval]
    used_approvals: set[str] = field(default_factory=set)

    def identity_allows(self, principal: str, action: Action) -> bool:
        return action.resource in self.permissions.get(principal, frozenset())

    def execute(self, principal: str, action: Action, approval_id: str, now: int) -> Workload:
        """Model one sequential request with a trusted identity and logical clock.

        `principal` stands in for an authenticated identity and `now` is an
        injected logical clock for deterministic tests. In a real service the
        requester must not choose either value, and the worker must not be able
        to mint or edit approval records.
        """
        if type(action.replicas) is not int or action.replicas < 0:
            raise Denied("invalid_replicas")
        if not self.identity_allows(principal, action):
            raise Denied("identity_scope")
        workload = self.workloads.get(action.resource)
        if workload is None:
            raise Denied("unknown_resource")
        approval = self.approvals.get(approval_id)
        if approval is None:
            raise Denied("approval_missing")
        if approval_id in self.used_approvals:
            raise Denied("approval_used")
        if approval.principal != principal:
            raise Denied("approval_identity")
        if now >= approval.expires_at:
            raise Denied("approval_expired")
        if approval.action != action:
            raise Denied("action_changed")
        if approval.resource_version != workload.version:
            raise Denied("workload_changed")

        updated = Workload(action.replicas, workload.version + 1)
        self.workloads[action.resource] = updated
        self.used_approvals.add(approval_id)
        return replace(updated)


PRINCIPAL = "agent-run-17"
APPROVAL_ID = "review-42"
APPROVED_ACTION = Action("lab/queue-worker", 3)


def example_broker() -> Broker:
    resources = frozenset({"lab/queue-worker", "prod/queue-worker"})
    return Broker(
        workloads={
            "lab/queue-worker": Workload(replicas=2, version=7),
            "prod/queue-worker": Workload(replicas=10, version=11),
        },
        permissions={
            PRINCIPAL: resources,
            "agent-run-18": resources,
        },
        approvals={
            APPROVAL_ID: Approval(
                principal=PRINCIPAL,
                action=APPROVED_ACTION,
                resource_version=7,
                expires_at=120,
            ),
        },
    )


def report(
    label: str, broker: Broker, action: Action = APPROVED_ACTION,
    principal: str = PRINCIPAL, approval_id: str = APPROVAL_ID, now: int = 100,
) -> None:
    try:
        result = broker.execute(principal, action, approval_id, now)
    except Denied as error:
        print(f"{label}: DENIED {error}")
    else:
        print(f"{label}: APPLIED {action.resource} replicas={result.replicas} version={result.version}")


def main() -> None:
    print("Offline policy model. No sandbox, network calls, or infrastructure.")
    broad_identity = example_broker()
    print(
        "Broad identity permits production:",
        broad_identity.identity_allows(PRINCIPAL, Action("prod/queue-worker", 3)),
    )
    report("approved request", example_broker())
    report("changed target", example_broker(), Action("prod/queue-worker", 3))
    report("changed replicas", example_broker(), replace(APPROVED_ACTION, replicas=30))
    report("missing approval", example_broker(), approval_id="not-issued")
    report("different identity", example_broker(), principal="agent-run-18")
    report("expired approval", example_broker(), now=120)
    changed = example_broker()
    changed.workloads[APPROVED_ACTION.resource].version += 1
    report("changed workload", changed)
    replay = example_broker()
    replay.execute(PRINCIPAL, APPROVED_ACTION, APPROVAL_ID, now=100)
    report("replayed approval", replay, now=101)


if __name__ == "__main__":
    main()
