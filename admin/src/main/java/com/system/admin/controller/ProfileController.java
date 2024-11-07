package com.system.admin.controller;

import com.system.admin.exception.UserNotFoundException;
import com.system.admin.model.Profile;
import com.system.admin.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("${API_URL}")
public class ProfileController {
    private final ProfileService profileService;

    @Autowired
    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }
    @PutMapping("/profile/{id}")
    public ResponseEntity<Profile> editProfile(@PathVariable Long id, @RequestBody Profile profile) {
        try {
            Profile updatedProfile = profileService.editProfile(id, profile);
            return ResponseEntity.ok(updatedProfile);
        } catch (UserNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
