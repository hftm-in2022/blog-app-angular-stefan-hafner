# BlogAppAngular

# Maintenance Documentation for the Web Application

## 1. Application Setup

### Requirements

- Node.js (version 18 or higher)
- Angular CLI (version 18)
- npm or yarn as a package manager

### Setup Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## 2. CI/CD Pipeline

### Description

The application uses a CI/CD pipeline for automated deployment through GitHub Actions.

### Workflow File (.github/workflows/main.yml)

- **build**: Runs `npm install` and `ng build`.
- **test**: Executes unit tests using `ng test`.
- **deploy**: Deployment is done to an S3 bucket or a web server (based on configuration).

### Deployment

Deployment is triggered automatically when a push to the `main` branch occurs.
Do you can see on `https://blue-cliff-0b8ec9103.5.azurestaticapps.net/`

## 3. Angular File Structure

```
src/
│
├── app/               # Main module and components
│   ├── app.component.ts
│   ├── app.module.ts
│   ├── core/          # Core module and services
│   ├── shared/        # Reusable modules and services
│   └── features/      # Feature modules and components
│
├── assets/            # Static resources (images, icons)
├── environments/      # Environment variables for dev/prod
│
├── main.ts            # Application entry point
└── styles.scss        # Global styles
```

## 4. Design Patterns

### 4.1 Smart-Dumb Component Pattern

The app separates components by function:

- **Smart Components** (`app.component.ts`, `blog-overview-page.component.ts`, `blog-detail-page.component.ts`): Handle logic, services, and state.
- **Dumb Components** (`blog-card.component.ts`): Purely presentational with `@Input()`/`@Output()`.

### 4.2 Redux-like State Management Pattern

State is managed in `state.service.ts` using:

- **State Container:** `BehaviorSubject` and `signal` hold global state.
- **Reducers:** Methods like `setLoadingState` and `setSubmitError` update state immutably.
- **Async Actions:** `rxGetBlogs` fetches data via RxJS, mimicking Redux async actions.

## 5. Configurations

### Angular Configuration Files

- **angular.json**: Contains build and test configurations.
- **tsconfig.json**: TypeScript configuration.
- **package.json**: Lists all dependencies and scripts.

### Environment Variables

- **src/environments/environment.ts** (for development)
- **src/environments/environment.prod.ts** (for production)

---
