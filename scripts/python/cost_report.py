#!/usr/bin/env python3
"""
Pulls the current month's AWS cost breakdown by service using the Cost
Explorer API, and prints a clean summary. Intended to run on a schedule
(cron, or a CI pipeline job) so nobody has to remember to check the
AWS console manually.

Requires: boto3, and AWS credentials with Cost Explorer read access
(ce:GetCostAndUsage). Run with the same 'terraform' profile used
throughout this project, or set AWS_PROFILE in the environment.
"""

import boto3
from datetime import date, timedelta


def get_month_to_date_costs(profile_name: str = "terraform"):
    session = boto3.Session(profile_name=profile_name)
    ce = session.client("ce", region_name="us-east-1")  # Cost Explorer is only available in us-east-1

    today = date.today()
    start_of_month = today.replace(day=1)

    response = ce.get_cost_and_usage(
        TimePeriod={
            "Start": start_of_month.isoformat(),
            "End": today.isoformat(),
        },
        Granularity="MONTHLY",
        Metrics=["UnblendedCost"],
        GroupBy=[{"Type": "DIMENSION", "Key": "SERVICE"}],
    )

    return response["ResultsByTime"][0]["Groups"], response["ResultsByTime"][0]["TimePeriod"]


def format_report(groups, period) -> str:
    lines = [
        f"AWS Cost Report — {period['Start']} to {period['End']}",
        "=" * 50,
    ]

    total = 0.0
    rows = []
    for group in groups:
        service = group["Keys"][0]
        cost = float(group["Metrics"]["UnblendedCost"]["Amount"])
        if cost > 0.0001:  # skip the noise of $0.00 line items
            rows.append((service, cost))
            total += cost

    rows.sort(key=lambda r: r[1], reverse=True)

    if not rows:
        lines.append("No billable usage recorded this month. 🎉")
    else:
        for service, cost in rows:
            lines.append(f"  {service:<45} ${cost:>8.4f}")

    lines.append("-" * 50)
    lines.append(f"  {'TOTAL':<45} ${total:>8.4f}")

    return "\n".join(lines)


def main():
    groups, period = get_month_to_date_costs()
    report = format_report(groups, period)
    print(report)

    # Extend this later to push to Slack via a webhook, e.g.:
    # requests.post(SLACK_WEBHOOK_URL, json={"text": report})


if __name__ == "__main__":
    main()
