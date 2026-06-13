# 🚀 TepkiNet | Kurumsal Şikayet ve Çözüm Yönetim Platformu

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=28&pause=1000&color=2563EB&center=true&vCenter=true&width=800&lines=Complaint+Management+Platform;Spring+Boot+%2B+React+Architecture;JWT+Authentication+System;User+%7C+Company+%7C+Admin+Panels" alt="Typing SVG" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot-success?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/Security-JWT-orange?style=for-the-badge" />
</p>

---

# 🎯 Projenin Amacı

TepkiNet, kullanıcıların şirketlere yönelik şikayet oluşturabildiği, şirketlerin bu şikayetleri yönetip yanıtlayabildiği ve yöneticilerin platform genelinde denetim sağlayabildiği çok rollü bir şikayet yönetim platformudur.

Projenin temel amacı, müşteri şikayet süreçlerini merkezi bir yapı altında toplamak, kurumlar ile kullanıcılar arasındaki iletişimi dijitalleştirmek ve şikayet çözüm süreçlerini şeffaf hale getirmektir.

---

# ✨ Temel Özellikler

## 👤 Kullanıcı Paneli

* Güvenli kayıt ve giriş sistemi
* Şikayet oluşturma
* Şikayet durumlarını takip etme
* Kendi şikayet geçmişini görüntüleme
* Profil yönetimi
* Şifre sıfırlama sistemi

---

## 🏢 Kurumsal Hesap Paneli

* Kuruma ait şikayetleri görüntüleme
* Şikayet durumlarını güncelleme
* Destek görüşmelerini yönetme
* Kurumsal profil yönetimi
* Şirket performans takibi

---

## 🛡️ Yönetici Paneli

* Tüm kullanıcıları yönetme
* Tüm şirketleri yönetme
* Şikayet moderasyonu
* Kurumsal başvuru onay sistemi
* İstatistik ve raporlama ekranları
* Platform genelinde denetim araçları

---

# 🔐 Güvenlik Altyapısı

* JWT Authentication
* Role Based Authorization (RBAC)
* Spring Security
* Protected API Endpoints
* Yetki Bazlı Sayfa Erişimi
* Şifre Hashleme (BCrypt)

---

# 📊 Şikayet Yaşam Döngüsü

```text
Kullanıcı
    │
    ▼
Şikayet Oluşturur
    │
    ▼
Şirket Görüntüler
    │
    ▼
Durum Günceller
    │
    ▼
Kullanıcı Takip Eder
    │
    ▼
Admin Denetler
```

Desteklenen durumlar:

* PENDING
* OPEN
* IN_REVIEW
* ANSWERED
* RESOLVED
* CLOSED_BY_CUSTOMER

---

# 🏗️ Kullanılan Teknolojiler

| Katman     | Teknoloji                   |
| ---------- | --------------------------- |
| Frontend   | React + Vite                |
| Backend    | Spring Boot                 |
| Security   | Spring Security + JWT       |
| Database   | PostgreSQL                  |
| ORM        | Spring Data JPA / Hibernate |
| Build Tool | Maven                       |
| UI         | Tailwind CSS                |
| API        | RESTful API                 |

---

# 📂 Proje Mimarisi

```text
TepkiNet
│
├── frontend
│   ├── components
│   ├── pages
│   ├── layouts
│   ├── hooks
│   ├── services
│   ├── constants
│   └── utils
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   ├── dto
│   ├── config
│   ├── security
│   └── exception
│
└── database
    └── PostgreSQL
```

---

# ⚙️ Kurulum

## Backend

```bash
mvn spring-boot:run
```

Backend varsayılan olarak:

```text
http://localhost:8080
```

adresinde çalışır.

---

## Frontend

```bash
npm install
npm run dev
```

Frontend varsayılan olarak:

```text
http://localhost:5173
```

adresinde çalışır.

---

# 🎨 Tasarım Yaklaşımı

TepkiNet arayüzü;

* Responsive tasarım
* Açık/Koyu tema desteği
* Yönetim panelleri
* Modern dashboard yapısı
* Mobil uyumlu navigasyon

esas alınarak geliştirilmiştir.

---

# 👨‍💻 Geliştirici

**Mehmet Yalçın**

Software Engineering Student

GitHub: [https://github.com/<myalcin17>](https://github.com/myalcin17)

---

# 📜 Lisans

Bu proje eğitim, geliştirme ve portfolyo amaçlı hazırlanmıştır.

Tüm hakları saklıdır.
