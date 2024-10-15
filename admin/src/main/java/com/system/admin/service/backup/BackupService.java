package com.system.admin.service.backup;

import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class BackupService {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @Value("${backup.dir}")
    private String backupDir;

    public String backupDatabase() throws IOException, InterruptedException {
        String dbName = getDatabaseName(dbUrl);
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String backupFilePath = backupDir + File.separator + dbName + "_" + timestamp + ".sql";

        // Command to execute mysqldump
        String command = String.format("mysqldump -u%s -p%s %s -r %s",
                dbUsername, dbPassword, dbName, backupFilePath);

        Process process = Runtime.getRuntime().exec(command);
        int processComplete = process.waitFor();

        if (processComplete == 0) {
            return "Backup created successfully at " + backupFilePath;
        } else {
            throw new RuntimeException("Could not create the backup");
        }
    }

    private String getDatabaseName(String dbUrl) {
        // Example dbUrl: jdbc:mysql://localhost:3306/vi_pham_db?useSSL=false&serverTimezone=UTC
        String[] parts = dbUrl.split("/");
        String dbPart = parts[parts.length - 1];
        String dbName = dbPart.split("\\?")[0];
        return dbName;
    }
}

