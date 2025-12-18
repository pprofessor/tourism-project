package com.tourism.app.entity;

public enum AmbassadorStatus {
    PENDING_APPROVAL, // در انتظار تایید (پس از ثبت‌نام)
    ACTIVE, // تایید شده و فعال
    REJECTED, // رد شده توسط ادمین
    SUSPENDED, // تعلیق شده موقت
    INACTIVE // غیرفعال
}