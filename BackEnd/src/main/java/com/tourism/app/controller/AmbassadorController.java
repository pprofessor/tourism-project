package com.tourism.app.controller;

import com.tourism.app.entity.Ambassador;
import com.tourism.app.entity.AmbassadorRequest;
import com.tourism.app.model.User;
import com.tourism.app.service.AmbassadorService;
import com.tourism.app.service.AmbassadorRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ambassadors")
@CrossOrigin(origins = "*")
public class AmbassadorController {

    @Autowired
    private AmbassadorService ambassadorService;

    @Autowired
    private AmbassadorRequestService requestService;

    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    // ============ AMBASSADOR ENDPOINTS ============

    // دریافت لیست سفیران (با فیلتر)
    @GetMapping
    public ResponseEntity<List<Ambassador>> getAmbassadors(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) Double minRate,
            @RequestParam(required = false) Double maxRate,
            @RequestParam(required = false) Double minRating) {
        List<Ambassador> ambassadors = ambassadorService.searchAmbassadors(
                city, country, minRate, maxRate, minRating);
        return ResponseEntity.ok(ambassadors);
    }

    // دریافت سفیران یک شهر
    @GetMapping("/city/{city}")
    public ResponseEntity<List<Ambassador>> getAmbassadorsByCity(@PathVariable String city) {
        List<Ambassador> ambassadors = ambassadorService.getAmbassadorsByCity(city);
        return ResponseEntity.ok(ambassadors);
    }

    // دریافت سفیران verified
    @GetMapping("/verified")
    public ResponseEntity<List<Ambassador>> getVerifiedAmbassadors() {
        List<Ambassador> ambassadors = ambassadorService.getVerifiedAmbassadors();
        return ResponseEntity.ok(ambassadors);
    }

    // دریافت اطلاعات یک سفیر
    @GetMapping("/{id}")
    public ResponseEntity<Ambassador> getAmbassadorById(@PathVariable Long id) {
        Ambassador ambassador = ambassadorService.getAmbassadorById(id);
        return ResponseEntity.ok(ambassador);
    }

    // ثبت‌نام به عنوان سفیر
    @PostMapping("/register")
    public ResponseEntity<?> registerAsAmbassador(
            @AuthenticationPrincipal User currentUser,
            @RequestBody Ambassador ambassadorData) {
        try {
            Ambassador ambassador = ambassadorService.createAmbassador(currentUser, ambassadorData);
            return ResponseEntity.status(HttpStatus.CREATED).body(ambassador);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // به‌روزرسانی پروفایل سفیر
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAmbassador(
            @PathVariable Long id,
            @RequestBody Ambassador ambassadorData,
            @AuthenticationPrincipal User currentUser) {
        try {
            // بررسی مالکیت (سفیر فقط می‌تواند پروفایل خودش را ویرایش کند)
            Ambassador existing = ambassadorService.getAmbassadorById(id);
            if (!existing.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You can only update your own profile"));
            }

            Ambassador updated = ambassadorService.updateAmbassador(id, ambassadorData);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // تغییر وضعیت available
    @PatchMapping("/{id}/availability")
    public ResponseEntity<?> toggleAvailability(
            @PathVariable Long id,
            @RequestParam boolean available,
            @AuthenticationPrincipal User currentUser) {
        try {
            Ambassador ambassador = ambassadorService.getAmbassadorById(id);
            if (!ambassador.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied"));
            }

            Ambassador updated = ambassadorService.toggleAvailability(id, available);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ============ REQUEST ENDPOINTS ============

    // ایجاد درخواست جدید
    @PostMapping("/requests")
    public ResponseEntity<?> createRequest(
            @AuthenticationPrincipal User currentUser,
            @RequestBody Map<String, Object> requestData) {
        try {
            Long ambassadorId = Long.parseLong(requestData.get("ambassadorId").toString());
            String serviceType = (String) requestData.get("serviceType");
            String startTimeStr = (String) requestData.get("startTime");
            String endTimeStr = (String) requestData.get("endTime");
            String notes = (String) requestData.get("notes");

            LocalDateTime startTime = LocalDateTime.parse(startTimeStr, formatter);
            LocalDateTime endTime = LocalDateTime.parse(endTimeStr, formatter);

            AmbassadorRequest request = requestService.createRequest(
                    currentUser, ambassadorId, serviceType, startTime, endTime, notes);

            return ResponseEntity.status(HttpStatus.CREATED).body(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // دریافت درخواست‌های من (به عنوان توریست)
    @GetMapping("/my-requests")
    public ResponseEntity<List<AmbassadorRequest>> getMyRequests(
            @AuthenticationPrincipal User currentUser) {
        List<AmbassadorRequest> requests = requestService.getTouristRequests(currentUser);
        return ResponseEntity.ok(requests);
    }

    // دریافت درخواست‌های یک سفیر (برای خود سفیر)
    @GetMapping("/{id}/requests")
    public ResponseEntity<?> getAmbassadorRequests(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        try {
            Ambassador ambassador = ambassadorService.getAmbassadorById(id);

            // بررسی مالکیت
            if (!ambassador.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied"));
            }

            List<AmbassadorRequest> requests = requestService.getAmbassadorRequests(ambassador);
            return ResponseEntity.ok(requests);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // تغییر وضعیت درخواست (برای سفیر)
    @PatchMapping("/requests/{requestId}/status")
    public ResponseEntity<?> updateRequestStatus(
            @PathVariable Long requestId,
            @RequestParam String status,
            @AuthenticationPrincipal User currentUser) {
        try {
            AmbassadorRequest.Status newStatus = AmbassadorRequest.Status.valueOf(status.toUpperCase());
            AmbassadorRequest updated = requestService.updateRequestStatus(requestId, newStatus);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ثبت نظر توریست
    @PostMapping("/requests/{requestId}/review")
    public ResponseEntity<?> addTouristReview(
            @PathVariable Long requestId,
            @RequestBody Map<String, Object> reviewData,
            @AuthenticationPrincipal User currentUser) {
        try {
            Integer rating = (Integer) reviewData.get("rating");
            String review = (String) reviewData.get("review");

            AmbassadorRequest updated = requestService.addTouristReview(requestId, rating, review);

            // به‌روزرسانی امتیاز سفیر
            Ambassador ambassador = updated.getAmbassador();
            ambassadorService.updateRating(ambassador.getId(), rating.doubleValue());

            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // پرداخت بیعانه
    @PostMapping("/requests/{requestId}/pay-deposit")
    public ResponseEntity<?> payDeposit(@PathVariable Long requestId) {
        try {
            AmbassadorRequest request = requestService.markDepositPaid(requestId);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // پرداخت کامل
    @PostMapping("/requests/{requestId}/pay-full")
    public ResponseEntity<?> payFull(@PathVariable Long requestId) {
        try {
            AmbassadorRequest request = requestService.markFullPaymentPaid(requestId);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ============ STATS ============

    // آمار سفیر
    @GetMapping("/{id}/stats")
    public ResponseEntity<Map<String, Object>> getAmbassadorStats(@PathVariable Long id) {
        try {
            Ambassador ambassador = ambassadorService.getAmbassadorById(id);

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalRequests", ambassador.getCompletedTasks());
            stats.put("rating", ambassador.getRating());
            stats.put("hourlyRate", ambassador.getHourlyRate());
            stats.put("isAvailable", ambassador.getIsAvailable());
            stats.put("languages", ambassador.getLanguages().size());
            stats.put("services", ambassador.getServices().size());

            return ResponseEntity.ok(stats);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}