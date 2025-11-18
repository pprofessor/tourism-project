package com.tourism.app.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class RateLimitingService {

    private final Map<String, RequestCounter> counters = new ConcurrentHashMap<>();

    public enum Plan {
        OTP(10, 60000), // 10 requests per minute
        LOGIN(5, 60000), // 5 requests per minute
        GENERAL(30, 60000); // 30 requests per minute

        private final int maxRequests;
        private final long timeWindowMs;

        Plan(int maxRequests, long timeWindowMs) {
            this.maxRequests = maxRequests;
            this.timeWindowMs = timeWindowMs;
        }

        public int getMaxRequests() {
            return maxRequests;
        }

        public long getTimeWindowMs() {
            return timeWindowMs;
        }
    }

    private static class RequestCounter {
        private final AtomicInteger count = new AtomicInteger(0);
        private final AtomicLong resetTime = new AtomicLong(System.currentTimeMillis());

        public boolean tryIncrement(int maxRequests, long timeWindowMs) {
            long currentTime = System.currentTimeMillis();
            long counterResetTime = resetTime.get();

            // Reset counter if time window has passed
            if (currentTime - counterResetTime > timeWindowMs) {
                if (resetTime.compareAndSet(counterResetTime, currentTime)) {
                    count.set(0);
                }
            }

            // Check if under limit
            return count.incrementAndGet() <= maxRequests;
        }
    }

    public boolean tryConsume(String key, Plan plan) {
        RequestCounter counter = counters.computeIfAbsent(key + ":" + plan.name(),
                k -> new RequestCounter());
        return counter.tryIncrement(plan.getMaxRequests(), plan.getTimeWindowMs());
    }

    public void clearRateLimit(String key, Plan plan) {
        counters.remove(key + ":" + plan.name());
    }
}