"""
Unit test suite for Elexon WindIQ Day-Ahead Decision Dashboard
"""

import unittest
import asyncio
from backend.main import (
    get_decision_dashboard,
    compute_error_histogram,
    health_check,
    AVAILABLE_DATES,
)


class TestDecisionDashboardAPI(unittest.TestCase):

    def test_datasets_loaded(self):
        self.assertEqual(len(AVAILABLE_DATES), 31)
        self.assertIn("2026-01-01", AVAILABLE_DATES)
        self.assertIn("2026-01-31", AVAILABLE_DATES)

    def test_health_check(self):
        async def run_h():
            res = await health_check()
            self.assertEqual(res["status"], "healthy")
            self.assertEqual(res["available_january_days"], 31)

        asyncio.run(run_h())

    def test_compute_error_histogram(self):
        errors = [-2000, -1000, 0, 500, 1000, 1500, 2000, 2500]
        bins = compute_error_histogram(errors, num_bins=4)
        self.assertEqual(len(bins), 4)
        total_count = sum(b["count"] for b in bins)
        self.assertEqual(total_count, len(errors))

    def test_decision_dashboard_single_day(self):
        async def run_dash():
            res = await get_decision_dashboard(delivery_date="2026-01-14", cutoff_time="09:20")
            self.assertEqual(res["mode"], "day")
            self.assertEqual(res["delivery_date"], "2026-01-14")
            self.assertEqual(res["decision_date"], "2026-01-13")
            self.assertEqual(res["cutoff_time"], "09:20")
            self.assertIn("07:30", res["latest_publish_time"])
            self.assertEqual(len(res["chart_data"]), 48)
            self.assertFalse(res["data_gaps"]["has_gaps"])
            self.assertGreater(res["metrics"]["mae"], 0)
            self.assertIn("buffer beyond the forecast", res["buffer_recommendation"]["advice_text"])

        asyncio.run(run_dash())

    def test_decision_dashboard_whole_month(self):
        async def run_month():
            res = await get_decision_dashboard(delivery_date="whole_month", cutoff_time="09:20")
            self.assertEqual(res["mode"], "month")
            self.assertEqual(res["cutoff_time"], "09:20")
            self.assertEqual(len(res["chart_data"]), 48)
            self.assertEqual(res["metrics"]["count"], 1488)
            self.assertGreater(res["metrics"]["bias"], 1000)
            self.assertIn("buffer beyond the forecast", res["buffer_recommendation"]["advice_text"])
            self.assertGreater(len(res["error_histogram"]), 0)
            self.assertGreater(len(res["scatter_data"]), 0)

        asyncio.run(run_month())


if __name__ == "__main__":
    unittest.main()

