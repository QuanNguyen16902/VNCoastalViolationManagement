# Vietnam Coastal Violation Management 🚢⚖️

## 📌 Introduction
**Vietnam Coastal Violation Management** is an administrative violation management system in the maritime domain.  
This project is developed to support the **Vietnam Coast Guard** in:  
- Managing violation cases.  
- Managing individuals/organizations that commit violations.  
- Handling penalties and monitoring their execution.  
- Automating report generation, invoices, and records.  
- Enabling fast and transparent online payments.  

The system helps **digitize violation management data** instead of manual paperwork, thereby improving efficiency, saving time, and minimizing errors.  
Link: http://ec2-54-226-64-202.compute-1.amazonaws.com/login

---

## ⚙️ Key Features
### 👨‍✈ Admin
- Manage user accounts (create, update, delete, assign roles).  
- Configure system parameters, roles, and permissions.  
- View system logs.  

### 🚨 Violation Management
- Create, update, and delete violation cases.  
- Manage violators (individuals and organizations).  
- Manage penalty decisions.  
- Search, filter, and generate statistics by time or violation type.  

### 📊 Reporting & Statistics
- Generate reports and penalty records with **Jasper Report**.  
- Visualization and charts for management purposes.  
- Quick access to violation history.  

### 💳 Online Payment
- Integrated with **VNPay** for online fine payment.  
- Secure and transparent transactions with verification.  

### 📷 Supporting Features
- **QR Code scanning** via **ZXing** for quick access to records.  
- Store **profile images** securely on **Cloudinary**.  
- Download violation records directly from the system.  

### 🔐 Security
- Login/Logout.  
- Change/Reset password.  
- Lock/Unlock user accounts.  
- Role-based access control with detailed permissions.  

---

## 🛠️ Technologies
- **Backend**: Java, Spring Boot, Spring Security, Spring Data JPA, Hibernate  
- **Frontend**: ReactJS, Material UI  
- **Database**: MySQL  
- **Authentication**: JWT (JSON Web Token)  
- **Payment**: VNPay  
- **Reporting**: Jasper Report  
- **QR Scanning**: ZXing  
- **Media Storage**: Cloudinary  
- **Deployment**: AWS (VPC, EC2, S3, RDS, IAM)  
- **Other**: RESTful API, Axios  

---
## Authentication Work Flow
<p>
  <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1758790269/spring-security-refresh-token-jwt-spring-boot-flow_cto9hu.png" width="80%" alt="Login Work Flow"/>
</p>

## 🏗️ System Architecture
<p>
  <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757352252/architecture-newst_uxyvqw.png" alt="Architecture" width="100%"/>
</p>
---

## 📷 UI Showcase

### 🔑 Sign In, Sign Up, Forgot Password
<p align="center">
  <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347606/login_ueclej.png" alt="Login Page" width="33%"/>
  <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347608/Register_q1zpze.png" alt="Register Page" width="33%"/>
  <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347605/forgot-pass_wmyt5m.jpg" alt="Forgot Password Page" width="33%"/>
</p>

### 👥 User Management
<p>
   <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347611/user_hjndqa.png" alt="User Management" width="33%"/>
   <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347611/user-form_yz1erw.png" alt="User Management" width="33%"/>
</p>

### 👥 Role, Permission Management
<p>
   <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347608/role_lixpij.png" alt="Role Management" width="33%"/>
   <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347607/permission_rukmdf.png" alt="User Management" width="33%"/>
</p>

### 👥 Violation Management
<p>
   <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347613/violation-management_xe3oor.png" alt="Role Management" width="33%"/>
   <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347606/add-violation_gwljr6.png" alt="User Management" width="33%"/>
   <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347609/search-violation_rrorr0.png" alt="User Management" width="33%"/>
</p>

### 👥 Penalty Decision Management
<p>
   <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347605/dedication-list_fkqvga.png" alt="Role Management" width="33%"/>
   <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347607/dedication-form_clapvg.png" alt="User Management" width="33%"/>
   <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347605/dedication-list_fkqvga.png" alt="User Management" width="33%"/>
</p>

### 👥 Settings
<p>
   <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347609/settings-1_p935im.png" alt="Setting1" width="33%"/>
   <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347609/settings-2_fhjxx3.png" alt="Setting2" width="33%"/>
   <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347610/settings-4_uid4ir.png" alt="Setting3" width="33%"/>
  
</p>

### 👥 Logging
<p>
   <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347606/log-system_smscbn.png" alt="Logging" width="50%"/>
</p>

### 👥 Report, Statistics
<p>
   <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347605/analytics_fkn58t.png" alt="Role Management" width="33%"/>
   <img src="https://res.cloudinary.com/dy2agire0/image/upload/v1757347608/reports_qzgoo9.png" alt="User Management" width="33%"/>
</p>

---

## 🚀 Installation & Run

### 1. Clone the repository
```bash
git clone https://github.com/QuanNguyen16902/vietnam-coastal-violation-management.git
cd vietnam-coastal-violation-management

