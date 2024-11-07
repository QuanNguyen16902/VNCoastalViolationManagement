package com.system.admin.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("${API_URL}")
public class ImageController {

    @Autowired
    private Cloudinary cloudinary;

    @PostMapping("/photos/upload")
    public ResponseEntity<?> uploadPhoto(@RequestParam("photo") MultipartFile photo) {
        try {
            Map uploadResult = cloudinary.uploader().upload(photo.getBytes(),
                    ObjectUtils.asMap("resource_type", "auto"));
            String photoUrl = (String) uploadResult.get("url");

            // Trả về URL của ảnh đã tải lên
            return ResponseEntity.ok(photoUrl);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi tải lên ảnh");
        }
    }
}
