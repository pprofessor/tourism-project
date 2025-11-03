# Project Structure
PROJECT_ROOT/
│
├── Admin-Panel/
│ ├── build/
│ │ ├── static/
│ │ │ ├── css/
│ │ │ └── js/
│ │ ├── index.html
│ │ ├── logo192.png
│ │ ├── logo512.png
│ │ ├── manifest.json
│ │ └── robots.txt
│ ├── node_modules/
│ ├── public/
│ │ ├── favicon.ico
│ │ ├── index.html
│ │ ├── logo192.png
│ │ ├── logo512.png
│ │ ├── manifest.json
│ │ └── robots.txt
│ ├── src/
│ │ ├── components/
│ │ │ ├── DatabaseManager/
│ │ │ │ ├── DatabaseManager.tsx
│ │ │ │ ├── DatabaseTerminal.tsx
│ │ │ │ ├── DataExport.tsx
│ │ │ │ ├── HotelManagement.tsx
│ │ │ │ ├── MediaManager.tsx
│ │ │ │ ├── PaymentGatewayManagement.tsx
│ │ │ │ ├── SliderManagement.tsx
│ │ │ │ └── UserManagement.tsx
│ │ │ ├── Layout/
│ │ │ │ ├── MyLayout.tsx
│ │ │ │ ├── MyMenu.tsx
│ │ │ │ ├── Sidebar.tsx.bak
│ │ │ │ └── SimpleLayout.tsx
│ │ ├── contexts/
│ │ │ └── AuthContext.tsx
│ │ ├── services/
│ │ │ ├── adminService.ts
│ │ │ ├── authService.ts
│ │ │ ├── mediaService.ts
│ │ │ └── sliderService.ts
│ │ ├── App.css
│ │ ├── App.tsx
│ │ ├── Dashboard.tsx
│ │ ├── dataProvider.ts
│ │ ├── index.css
│ │ ├── index.tsx
│ │ ├── Login.tsx
│ │ ├── logo.svg
│ │ ├── react-app-env.d.ts
│ │ ├── Register.tsx
│ │ ├── reportWebVitals.ts
│ │ └── setupTests.ts
│ ├── .gitignore
│ ├── Dockerfile
│ ├── package-lock.json
│ ├── package.json
│ ├── README.md
│ └── tsconfig.json
│
├── BackEnd/
│ ├── .mvn/
│ │ └── wrapper/
│ │ └── maven-wrapper.properties
│ ├── .vscode/
│ │ ├── launch.json
│ │ └── settings.json
│ ├── logs/
│ │ └── tourism-app.log
│ ├── node_modules/
│ ├── src/
│ │ ├── main/
│ │ │ ├── java/com/tourism/app/
│ │ │ │ ├── config/
│ │ │ │ │ ├── CorsConfig.java
│ │ │ │ │ ├── JwtUtil.java
│ │ │ │ │ ├── MediaConfig.java.bak
│ │ │ │ │ ├── SecurityConfig.java
│ │ │ │ │ └── WebConfig.java
│ │ │ │ ├── controller/
│ │ │ │ │ ├── AdminSlideController.java
│ │ │ │ │ ├── AuthController.java
│ │ │ │ │ ├── BookingController.java
│ │ │ │ │ ├── FileUploadController.java
│ │ │ │ │ ├── HotelController.java
│ │ │ │ │ ├── MediaController.java
│ │ │ │ │ ├── PaymentController.java
│ │ │ │ │ ├── SlideController.java
│ │ │ │ │ ├── StatsController.java
│ │ │ │ │ ├── UserController.java
│ │ │ │ │ ├── UserLevelController.java
│ │ │ │ │ └── VerificationController.java
│ │ │ │ ├── entity/
│ │ │ │ │ └── Slide.java
│ │ │ │ ├── model/
│ │ │ │ │ ├── Booking.java
│ │ │ │ │ ├── Hotel.java
│ │ │ │ │ ├── Payment.java
│ │ │ │ │ └── User.java
│ │ │ │ ├── repository/
│ │ │ │ │ ├── BookingRepository.java
│ │ │ │ │ ├── HotelRepository.java
│ │ │ │ │ ├── PaymentRepository.java
│ │ │ │ │ ├── SlideRepository.java
│ │ │ │ │ └── UserRepository.java
│ │ │ │ ├── service/
│ │ │ │ │ ├── SmsService.java
│ │ │ │ │ └── UserLevelService.java
│ │ │ │ └── AppApplication.java
│ │ │ └── resources/
│ │ │ ├── META-INF/
│ │ │ │ ├── additional-spring-configuration-metadata.json
│ │ │ │ └── spring-configuration-metadata.json
│ │ │ ├── static/
│ │ │ ├── templates/
│ │ │ ├── application-docker.properties
│ │ │ ├── application-postgresql.properties
│ │ │ ├── application.properties
│ │ │ └── data.sql.Back
│ │ ├── test/java/com/tourism/app/
│ │ │ └── AppApplicationTests.java
│ │ └── target/
│ │ ├── classes/
│ │ ├── generated-sources/
│ │ ├── generated-test-sources/
│ │ ├── maven-archiver/
│ │ ├── maven-status/
│ │ ├── test-classes/
│ │ ├── BackEnd-0.0.1-SNAPSHOT.jar
│ │ └── BackEnd-0.0.1-SNAPSHOT.jar.original
│ ├── uploads/
│ ├── .gitattributes
│ ├── .gitignore
│ ├── Dockerfile
│ ├── HELP.md
│ ├── mvnw
│ ├── mvnw.cmd
│ └── pom.xml
│
├── FrontEnd/
│ ├── build/
│ ├── node_modules/
│ ├── public/
│ │ ├── locales/
│ │ │ ├── ar/
│ │ │ │ └── common.json
│ │ │ ├── en/
│ │ │ │ └── common.json
│ │ │ ├── fa/
│ │ │ │ └── common.json
│ │ │ ├── tr/
│ │ │ │ └── common.json
│ │ ├── favicon.ico
│ │ ├── index.html
│ │ ├── logo192.png
│ │ ├── logo512.png
│ │ ├── manifest.json
│ │ └── robots.txt
│ ├── src/
│ │ ├── components/
│ │ │ ├── ContactSection.tsx
│ │ │ ├── FAOSection.tsx
│ │ │ ├── Footer.tsx
│ │ │ ├── Header.tsx
│ │ │ ├── HotelCard.tsx
│ │ │ ├── LoginModal.tsx
│ │ │ ├── PaymentGateway.tsx
│ │ │ ├── PaymentHistory.tsx
│ │ │ ├── ProfileForm.tsx
│ │ │ ├── ProfileImageUpload.tsx
│ │ │ ├── SupportTickets.tsx
│ │ │ └── UserServices.tsx
│ │ ├── context/
│ │ │ ├── CartContext.tsx
│ │ │ └── ThemeContext.tsx
│ │ ├── i18n/
│ │ │ └── config.ts
│ │ ├── pages/
│ │ │ ├── Home.tsx
│ │ │ ├── Profile.tsx
│ │ │ └── Support.tsx
│ │ ├── services/
│ │ │ ├── authMockService.ts
│ │ │ ├── authService.ts
│ │ │ ├── mediaService.ts
│ │ │ └── slideService.ts
│ │ ├── types/
│ │ │ └── support.ts
│ │ ├── App.css
│ │ ├── App.tsx
│ │ ├── index.css
│ │ ├── index.tsx
│ │ ├── logo.svg
│ │ ├── react-app-env.d.ts
│ │ ├── reportWebVitals.ts
│ │ └── setupTests.ts
│ ├── .gitignore
│ ├── Dockerfile
│ ├── nginx.conf
│ ├── package-lock.json
│ ├── package.json
│ ├── postcss.config.js
│ ├── README.md
│ └── tailwind.config.js
│
├── Media/
├── Monitoring/
│
├── .env
├── docker-compose.yml
├── files_list.txt
├── generate_structure.bat
├── README.md
└── temp_tree.txt
*Generated from project structure analysis on 2024-01-15*