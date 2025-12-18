package com.tourism.app.controller;

import com.tourism.app.dto.AmbassadorRegistrationDTO;
import com.tourism.app.entity.Ambassador;
import com.tourism.app.entity.AmbassadorRequest;
import com.tourism.app.model.User;
import com.tourism.app.service.AmbassadorRegistrationService;
import com.tourism.app.service.AmbassadorRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/ambassadors")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AmbassadorController {

    private final AmbassadorRegistrationService ambassadorService;
    private final AmbassadorRequestService requestService;
    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    // ============ NEW REGISTRATION ENDPOINTS ============

    @GetMapping("/my-registration")
    public ResponseEntity<?> getMyRegistration(@AuthenticationPrincipal User currentUser) {
        try {
            return ResponseEntity.ok(ambassadorService.getUserRegistrationStatus(currentUser));
        } catch (Exception e) {
            return errorResponse("Failed to fetch registration", e);
        }
    }

    @PostMapping("/save-draft")
    public ResponseEntity<?> saveRegistrationDraft(
            @AuthenticationPrincipal User currentUser,
            @RequestBody AmbassadorRegistrationDTO dto) {
        try {
            return ResponseEntity.ok(ambassadorService.saveDraft(currentUser, dto));
        } catch (IllegalArgumentException e) {
            return errorResponse("Validation error", e);
        } catch (Exception e) {
            return errorResponse("Failed to save draft", e);
        }
    }

    @PostMapping("/submit-registration")
    public ResponseEntity<?> submitRegistration(
            @AuthenticationPrincipal User currentUser,
            @RequestBody AmbassadorRegistrationDTO dto) {
        try {
            return ResponseEntity.ok(ambassadorService.submitRegistration(currentUser, dto));
        } catch (IllegalArgumentException e) {
            return errorResponse("Validation error", e);
        } catch (Exception e) {
            return errorResponse("Failed to submit registration", e);
        }
    }

    // ============ EXISTING ENDPOINTS ============

    @GetMapping
    public ResponseEntity<List<Ambassador>> getAmbassadors(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) Double minRate,
            @RequestParam(required = false) Double maxRate,
            @RequestParam(required = false) Double minRating) {
        try {
            return ResponseEntity.ok(ambassadorService.searchAmbassadors(city, country, minRate, maxRate, minRating));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }

    @GetMapping("/my-status")
    public ResponseEntity<?> getMyAmbassadorStatus(@AuthenticationPrincipal User currentUser) {
        try {
            return ResponseEntity.ok(ambassadorService.getCurrentUserAmbassadorStatus(currentUser));
        } catch (Exception e) {
            return errorResponse("Failed to fetch status", e);
        }
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<Ambassador>> getAmbassadorsByCity(@PathVariable String city) {
        try {
            return ResponseEntity.ok(ambassadorService.getAmbassadorsByCity(city));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }

    @GetMapping("/verified")
    public ResponseEntity<List<Ambassador>> getVerifiedAmbassadors() {
        try {
            return ResponseEntity.ok(ambassadorService.getVerifiedAmbassadors());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ambassador> getAmbassadorById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ambassadorService.getAmbassadorById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // ثبت‌نام قدیمی
    @PostMapping("/register")
    public ResponseEntity<?> registerAsAmbassador(
            @AuthenticationPrincipal User currentUser,
            @RequestBody Ambassador ambassadorData) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ambassadorService.createAmbassador(currentUser, ambassadorData));
        } catch (Exception e) {
            return errorResponse("Failed to register", e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAmbassador(
            @PathVariable Long id,
            @RequestBody Ambassador ambassadorData,
            @AuthenticationPrincipal User currentUser) {
        try {
            return ResponseEntity.ok(ambassadorService.updateAmbassador(id, ambassadorData, currentUser));
        } catch (Exception e) {
            return errorResponse("Failed to update", e);
        }
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<?> toggleAvailability(
            @PathVariable Long id,
            @RequestParam boolean available,
            @AuthenticationPrincipal User currentUser) {
        try {
            return ResponseEntity.ok(ambassadorService.toggleAvailability(id, available, currentUser));
        } catch (Exception e) {
            return errorResponse("Failed to toggle availability", e);
        }
    }

    // ============ REQUEST ENDPOINTS ============

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
            return errorResponse("Failed to create request", e);
        }
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<AmbassadorRequest>> getMyRequests(
            @AuthenticationPrincipal User currentUser) {
        try {
            return ResponseEntity.ok(requestService.getTouristRequests(currentUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }

    @GetMapping("/{id}/requests")
    public ResponseEntity<?> getAmbassadorRequests(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        try {
            return ResponseEntity.ok(ambassadorService.getAmbassadorRequests(id, currentUser));
        } catch (Exception e) {
            return errorResponse("Failed to fetch requests", e);
        }
    }

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
            return errorResponse("Invalid status", e);
        } catch (Exception e) {
            return errorResponse("Failed to update status", e);
        }
    }

    @PostMapping("/requests/{requestId}/review")
    public ResponseEntity<?> addTouristReview(
            @PathVariable Long requestId,
            @RequestBody Map<String, Object> reviewData,
            @AuthenticationPrincipal User currentUser) {
        try {
            Integer rating = (Integer) reviewData.get("rating");
            String review = (String) reviewData.get("review");

            AmbassadorRequest updated = requestService.addTouristReview(requestId, rating, review);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return errorResponse("Failed to add review", e);
        }
    }

    @PostMapping("/requests/{requestId}/pay-deposit")
    public ResponseEntity<?> payDeposit(@PathVariable Long requestId) {
        try {
            AmbassadorRequest request = requestService.markDepositPaid(requestId);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return errorResponse("Failed to pay deposit", e);
        }
    }

    @PostMapping("/requests/{requestId}/pay-full")
    public ResponseEntity<?> payFull(@PathVariable Long requestId) {
        try {
            AmbassadorRequest request = requestService.markFullPaymentPaid(requestId);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return errorResponse("Failed to pay full amount", e);
        }
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<?> getAmbassadorStats(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ambassadorService.getAmbassadorStats(id));
        } catch (Exception e) {
            return errorResponse("Failed to fetch stats", e);
        }
    }

    // ============ HELPER METHOD ============

    private ResponseEntity<Map<String, String>> errorResponse(String error, Exception e) {
        Map<String, String> response = new HashMap<>();
        response.put("error", error);
        response.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(response);
    }
}