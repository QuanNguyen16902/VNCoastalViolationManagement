package com.system.admin.service.backup;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.IOException;
@Service
public class RestoreService {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    public String restoreDatabase(String backupFilePath) throws IOException, InterruptedException {
        String dbName = getDatabaseName(dbUrl);

        // Command to execute mysql restore
        String command = String.format("mysql -u%s -p%s %s -e \"source %s\"",
                dbUsername, dbPassword, dbName, backupFilePath);

        Process process = Runtime.getRuntime().exec(command);
        int processComplete = process.waitFor();

        if (processComplete == 0) {
            return "Database restored successfully from " + backupFilePath;
        } else {
            throw new RuntimeException("Could not restore the database");
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
