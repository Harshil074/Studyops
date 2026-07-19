#!/usr/bin/env python3
"""
Hits the StudyOps API's health endpoints and reports status. Meant to
run externally (cron, a laptop, a separate monitoring host) as a
simple synthetic check — complements Prometheus, which monitors from
inside the cluster, by checking availability the way a real client
would: over the network, from outside.

Usage:
    python3 health_check.py --url http://localhost:8000
    python3 health_check.py --url https://your-real-domain.com
"""

import argparse
import sys
import time
from urllib.request import urlopen
from urllib.error import URLError, HTTPError


def check_endpoint(base_url: str, path: str, timeout: int = 5) -> tuple[bool, str]:
    url = f"{base_url.rstrip('/')}{path}"
    start = time.monotonic()
    try:
        with urlopen(url, timeout=timeout) as response:
            elapsed_ms = (time.monotonic() - start) * 1000
            status = response.status
            if status == 200:
                return True, f"OK ({elapsed_ms:.0f}ms)"
            return False, f"Unexpected status {status}"
    except HTTPError as e:
        return False, f"HTTP error: {e.code}"
    except URLError as e:
        return False, f"Connection failed: {e.reason}"
    except Exception as e:
        return False, f"Unexpected error: {e}"


def main():
    parser = argparse.ArgumentParser(description="Check StudyOps API health")
    parser.add_argument("--url", required=True, help="Base URL of the API, e.g. http://localhost:8000")
    parser.add_argument("--retries", type=int, default=1, help="Number of attempts before giving up (default: 1)")
    parser.add_argument("--retry-delay", type=int, default=3, help="Seconds to wait between retries")
    args = parser.parse_args()

    checks = [
        ("Liveness", "/health"),
        ("Readiness (DB connectivity)", "/health/ready"),
    ]

    print(f"StudyOps Health Check — {args.url}")
    print("=" * 50)

    all_healthy = True
    for name, path in checks:
        healthy, message = False, ""
        for attempt in range(1, args.retries + 1):
            healthy, message = check_endpoint(args.url, path)
            if healthy:
                break
            if attempt < args.retries:
                time.sleep(args.retry_delay)

        symbol = "✅" if healthy else "❌"
        suffix = f" (after {attempt} attempt{'s' if attempt > 1 else ''})" if attempt > 1 else ""
        print(f"  {symbol} {name:<30} {message}{suffix}")
        if not healthy:
            all_healthy = False

    print("=" * 50)
    if all_healthy:
        print("All checks passed.")
        sys.exit(0)
    else:
        print("One or more checks FAILED.")
        sys.exit(1)


if __name__ == "__main__":
    main()
