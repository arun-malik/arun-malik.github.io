from copy import deepcopy
from dataclasses import replace
import importlib.util
from pathlib import Path
import sys
import unittest


SOURCE = Path(__file__).resolve().parents[1] / "posts" / "sandbox-boundaries" / "sandbox_demo.py"
SPEC = importlib.util.spec_from_file_location("sandbox_demo", SOURCE)
demo = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = demo
SPEC.loader.exec_module(demo)


class SandboxDemoTests(unittest.TestCase):
    def setUp(self):
        self.broker = demo.example_broker()

    def execute(self, action=demo.APPROVED_ACTION, **overrides):
        arguments = {
            "principal": demo.PRINCIPAL,
            "action": action,
            "approval_id": demo.APPROVAL_ID,
            "now": 100,
        }
        arguments.update(overrides)
        return self.broker.execute(**arguments)

    def assert_denied_without_changes(self, reason, action=demo.APPROVED_ACTION, **overrides):
        before = deepcopy(self.broker)
        with self.assertRaisesRegex(demo.Denied, f"^{reason}$"):
            self.execute(action, **overrides)
        self.assertEqual(self.broker, before)

    def test_exact_approval_applies_only_the_lab_change(self):
        result = self.execute()
        self.assertEqual(result, demo.Workload(replicas=3, version=8))
        self.assertEqual(self.broker.workloads["prod/queue-worker"], demo.Workload(10, 11))
        self.assertEqual(self.broker.used_approvals, {demo.APPROVAL_ID})

    def test_broad_identity_does_not_authorize_a_changed_target(self):
        action = demo.Action("prod/queue-worker", 3)
        self.assertTrue(self.broker.identity_allows(demo.PRINCIPAL, action))
        self.assert_denied_without_changes("action_changed", action)

    def test_changed_parameters_require_another_approval(self):
        self.assert_denied_without_changes(
            "action_changed", replace(demo.APPROVED_ACTION, replicas=30),
        )

    def test_current_identity_scope_is_checked_even_with_an_existing_approval(self):
        self.broker.permissions[demo.PRINCIPAL] = frozenset()
        self.assert_denied_without_changes("identity_scope")

    def test_approval_is_bound_to_the_authenticated_identity(self):
        self.assert_denied_without_changes("approval_identity", principal="agent-run-18")

    def test_missing_approval_cannot_be_substituted(self):
        self.assert_denied_without_changes("approval_missing", approval_id="not-issued")

    def test_expiry_is_exclusive_and_denial_does_not_consume_approval(self):
        for now in (120, 121):
            with self.subTest(now=now):
                self.assert_denied_without_changes("approval_expired", now=now)
        self.assertEqual(self.execute(now=119).replicas, 3)

    def test_stale_resource_version_stops_the_change(self):
        self.broker.workloads[demo.APPROVED_ACTION.resource].version += 1
        self.assert_denied_without_changes("workload_changed")

    def test_successful_approval_cannot_be_replayed(self):
        self.execute()
        self.assert_denied_without_changes("approval_used", now=101)

    def test_invalid_replica_values_cannot_reach_the_mutation(self):
        for replicas in (-1, True, 3.5):
            with self.subTest(replicas=replicas):
                self.assert_denied_without_changes(
                    "invalid_replicas", replace(demo.APPROVED_ACTION, replicas=replicas),
                )


if __name__ == "__main__":
    unittest.main()
