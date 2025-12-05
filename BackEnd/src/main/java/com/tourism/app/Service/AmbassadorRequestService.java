package com.tourism.app.service;

import com.tourism.app.entity.Ambassador;
import com.tourism.app.entity.AmbassadorRequest;
import com.tourism.app.model.User;
import com.tourism.app.repository.AmbassadorRepository;
import com.tourism.app.repository.AmbassadorRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AmbassadorRequestService {

    @Autowired
    private AmbassadorRequestRepository requestRepository;

    @Autowired
    private AmbassadorRepository ambassadorRepository;

    // ایجاد درخواست جدید
    @Transactional
    public AmbassadorRequest createRequest(
            User tourist,
            Long ambassadorId,
            String serviceType,
            LocalDateTime startTime,
            LocalDateTime endTime,
            String notes) {
        // پیدا کردن سفیر
        Ambassador ambassador = ambassadorRepository.findById(ambassadorId)
                .orElseThrow(() -> new RuntimeException("Ambassador not found"));

        // بررسی available بودن سفیر
        if (!ambassador.getIsAvailable()) {
            throw new RuntimeException("Ambassador is not available");
        }

        // بررسی تداخل زمانی
        boolean hasConflict = requestRepository.hasTimeConflict(ambassador, startTime, endTime);
        if (hasConflict) {
            throw new RuntimeException("Ambassador has time conflict in this period");
        }

        // محاسبه قیمت
        long hours = java.time.Duration.between(startTime, endTime).toHours();
        Double totalPrice = ambassador.getHourlyRate() * hours;

        // ایجاد درخواست
        AmbassadorRequest request = new AmbassadorRequest();
        request.setTourist(tourist);
        request.setAmbassador(ambassador);
        request.setServiceType(serviceType);
        request.setStartTime(startTime);
        request.setEndTime(endTime);
        request.setNotes(notes);
        request.setTotalPrice(totalPrice);
        request.setStatus(AmbassadorRequest.Status.PENDING);

        return requestRepository.save(request);
    }

    // تغییر وضعیت درخواست
    @Transactional
    public AmbassadorRequest updateRequestStatus(Long requestId, AmbassadorRequest.Status status) {
        AmbassadorRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // بررسی مجوز تغییر وضعیت
        if (!canChangeStatus(request.getStatus(), status)) {
            throw new RuntimeException("Invalid status transition");
        }

        request.setStatus(status);

        // اگر وضعیت به COMPLETED تغییر کرد، امتیازدهی فعال شود
        if (status == AmbassadorRequest.Status.COMPLETED) {
            // در اینجا می‌توانید ایمیل/نوتیفیکیشن برای امتیازدهی ارسال کنید
        }

        return requestRepository.save(request);
    }

    // بررسی valid بودن تغییر وضعیت
    private boolean canChangeStatus(AmbassadorRequest.Status current, AmbassadorRequest.Status next) {
        // فقط برخی transitionها مجاز هستند
        switch (current) {
            case PENDING:
                return next == AmbassadorRequest.Status.ACCEPTED ||
                        next == AmbassadorRequest.Status.REJECTED;
            case ACCEPTED:
                return next == AmbassadorRequest.Status.IN_PROGRESS ||
                        next == AmbassadorRequest.Status.CANCELLED;
            case IN_PROGRESS:
                return next == AmbassadorRequest.Status.COMPLETED ||
                        next == AmbassadorRequest.Status.DISPUTED;
            case COMPLETED:
            case REJECTED:
            case CANCELLED:
            case DISPUTED:
                return false; // وضعیت‌های نهایی قابل تغییر نیستند
            default:
                return false;
        }
    }

    // ثبت نظر و امتیاز از طرف توریست
    @Transactional
    public AmbassadorRequest addTouristReview(Long requestId, Integer rating, String review) {
        AmbassadorRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // فقط درخواست‌های تکمیل شده قابل امتیازدهی هستند
        if (request.getStatus() != AmbassadorRequest.Status.COMPLETED) {
            throw new RuntimeException("Only completed requests can be reviewed");
        }

        // بررسی رنج امتیاز
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        request.setTouristRating(rating);
        request.setTouristReview(review);

        // به‌روزرسانی امتیاز سفیر (در AmbassadorService انجام می‌شود)
        // Ambassador ambassador = request.getAmbassador(); // این خط را حذف یا کامنت کن

        return requestRepository.save(request);
    }

    // ثبت نظر از طرف سفیر
    @Transactional
    public AmbassadorRequest addAmbassadorReview(Long requestId, Integer rating, String review) {
        AmbassadorRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (rating != null && (rating < 1 || rating > 5)) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        request.setAmbassadorRating(rating);
        request.setAmbassadorReview(review);

        return requestRepository.save(request);
    }

    // دریافت درخواست‌های یک توریست
    public List<AmbassadorRequest> getTouristRequests(User tourist) {
        return requestRepository.findByTourist(tourist);
    }

    // دریافت درخواست‌های یک سفیر
    public List<AmbassadorRequest> getAmbassadorRequests(Ambassador ambassador) {
        return requestRepository.findByAmbassador(ambassador);
    }

    // دریافت درخواست بر اساس ID
    public AmbassadorRequest getRequestById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
    }

    // پرداخت بیعانه
    @Transactional
    public AmbassadorRequest markDepositPaid(Long requestId) {
        AmbassadorRequest request = getRequestById(requestId);
        request.setDepositPaid(true);
        return requestRepository.save(request);
    }

    // پرداخت کامل
    @Transactional
    public AmbassadorRequest markFullPaymentPaid(Long requestId) {
        AmbassadorRequest request = getRequestById(requestId);
        request.setFullPaymentPaid(true);
        return requestRepository.save(request);
    }
}