package com.system.admin.service;

import com.system.admin.exception.UserNotFoundException;
import com.system.admin.model.Profile;
import com.system.admin.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
    @Autowired
    public ProfileRepository profileRepository;

    public Profile editProfile(Long id, Profile profile) {
        Profile existProfile = profileRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy profile id: " + id));

        existProfile.setRank(profile.getRank());
        existProfile.setPosition(profile.getPosition());
        existProfile.setDepartment(profile.getDepartment());
        existProfile.setFullName(profile.getFullName());
        return profileRepository.save(existProfile);
    }
}
