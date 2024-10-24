# Create basic angular project

- Styling: SCSS
- Server side rendering: No

```sh
ng new angular-<project name>-<first name>-<last name>
```

# Anleitung zur Einrichtung von Code-Qualitätstools für eine Angular-Anwendung

Diese Anleitung hilft Ihnen, Ihre Angular-Anwendung mit wichtigen Tools zur Codequalität und -formatierung auszustatten. Sie lernen, wie Sie ESLint, Prettier, Commitlint, lint-staged und Husky einrichten. Diese Tools helfen Ihnen, den Code sauber und konsistent zu halten sowie Best Practices beim Committen sicherzustellen.

## 1. ESLint in der Angular-Anwendung hinzufügen

**ESLint** ist ein Tool zur statischen Codeanalyse, das hilft, potenzielle Fehler zu finden und den Code konsistent zu halten.

1. Führen Sie folgenden Befehl aus, um ESLint zu Ihrem Angular-Projekt hinzuzufügen:

   ```
   ng add @angular-eslint/schematics
   ```

2. **Optional**: Weitere Informationen zur Integration von ESLint in Angular finden Sie in diesem Artikel: [How to Add ESLint to an Angular Application](https://www.freecodecamp.org/news/how-to-add-eslint-to-an-angular-application/).

## 2. Prettier installieren und konfigurieren

**Prettier** ist ein Code-Formatter, der Ihren Code automatisch gemäß definierten Stilregeln formatiert.

1. Installieren Sie Prettier als Entwicklungsabhängigkeit:

   ```
   npm install prettier --save-dev
   ```

2. Fügen Sie das folgende Skript zur `package.json` hinzu, um den Code innerhalb des `src/app`-Ordners zu formatieren:

   ```
   "scripts": {
    "format": "npx prettier --write src/app/**/*.ts"
   }
   ```

## 3. Environments für Angular generieren

Environments werden in Angular verwendet, um verschiedene Konfigurationsoptionen für unterschiedliche Umgebungen (z. B. Entwicklung, Produktion) zu definieren.

1. Generieren Sie die Umgebungskonfigurationsdateien:

   ```
   ng generate environments
   ```

2. Weitere Informationen finden Sie in der offiziellen Dokumentation: [Angular Build Guide](https://angular.io/guide/build).

## 4. Commitlint einrichten

**Commitlint** sorgt dafür, dass Ihre Commit-Nachrichten einem konventionellen Format folgen.

1. Installieren Sie Commitlint und die konventionelle Konfiguration global:

   ```
   npm install --save-dev @commitlint/cli @commitlint/config-conventional

   ```

2. Fügen Sie die folgende Konfiguration zur `package.json` hinzu:

   ```
   "commitlint": {
    "extends": [
      "@commitlint/config-conventional"
    ]
   }
   ```

   Weitere Informationen finden Sie unter [Commitlint](https://commitlint.js.org/#/).

## 5. lint-staged einrichten

**lint-staged** ermöglicht es, Lintern und Formatierungs-Tools nur auf die geänderten Dateien anzuwenden, was den Commit-Prozess beschleunigt.

1. Installieren Sie lint-staged als Entwicklungsabhängigkeit:

   ```
   npm install --save-dev lint-staged
   ```

2. Fügen Sie die folgende Konfiguration zur `package.json` hinzu:

   ```
   "lint-staged": {
    "*.{ts,js,html}": "eslint --cache --fix",
    "*.{ts,js,html,css,scss,less,md}": "prettier --write"
   }
   ```

   Weitere Informationen finden Sie unter [lint-staged](https://www.npmjs.com/package/lint-staged).

## 6. Husky einrichten

**Husky** ermöglicht es, Git-Hooks einfach zu verwalten und auszuführen, z.B. um automatisch Prettier und ESLint vor jedem Commit auszuführen.

1. Installieren Sie Husky:

   ```
   npm install --save-dev husky
   ```

2. Initialisieren Sie Husky:

   ```
   npx husky init
   ```

3. Fügen Sie das folgende Skript zur `package.json` hinzu, um Husky vorzubereiten:

   ```
   "scripts": {
    "prepare": "husky"
   }
   ```

4. Führen Sie das vorbereitende Skript aus:

   ```
   npm run prepare
   ```

5. Erstellen Sie den Commit-Hook für Commitlint:

   ```
   echo 'npx --no-install commitlint --edit "$1"' > .husky/commit-msg
   ```

6. Erstellen Sie den Pre-Commit-Hook für lint-staged:

   ```
   echo 'npx --no-install lint-staged' > .husky/pre-commit
   ```

   Weitere Informationen zu Husky finden Sie auf [GitHub](https://github.com/typicode/husky).

### Hinweis format commit-msg / pre-commit

Die 2 sollten unter Windows als Line-separator LF haben und UTF-8 sein

# Deployment einer Angular-App als Static Web App auf Azure

## 1. Azure Portal öffnen

- Gehe in das [Azure Portal](https://portal.azure.com).

## 2. Resource Group erstellen (falls nicht vorhanden)

- Wähle eine existierende Resource Group oder erstelle eine neue:
  - Suche im Azure-Portal nach "Resource Group".
  - Klicke auf "Erstellen" und fülle die notwendigen Felder aus (Name, Region, etc.).

## 3. Static Web App erstellen

- Suche nach "Static Web Apps" und klicke auf **"Erstellen"**.

### 3.1. Projekt-Parameter festlegen

- **Abonnement**: Wähle das richtige Abonnement aus.
- **Resource Group**: Wähle die bereits erstellte Resource Group.
- **Name der App**: Gib den Namen deiner Static Web App ein.
- **Plantyp**: Wähle den passenden Plan (z.b. Free: Hobby - oder Privateprojekte).
- **Bereitstellungsdetail** z.b. GitHub

#### 3.1.1 GitHub Framework- und Build-Einstellungen

- Wenn du ein GitHub-Repository nutzt:
  - Verbinde Azure mit deinem GitHub-Konto.
    - Wähle das Unternehmen , Repository, Branch
    - **Buildvoreinstellungen** Wähle das benutzte Framework z.b. Angular
    - **App-Speicherort** "/"
    - **API-Speicherort** kann leer gelassen werden

### 3.2 Deploment configuration

Da wir mit GitHub arbeiten wählen wir hier auch die GitHub Option aus

-** Klick auf "Weiter: Deploment configuration"**

- **GitHub** (aktuell ausgewählt):

  - Diese Option ermöglicht dir, dein Deployment direkt über GitHub durchzuführen. Azure verwendet GitHub Actions, um dein Projekt automatisch bei jedem Commit zu deployen.
  - **Empfehlung**: Wenn dein Code in einem GitHub-Repository liegt, solltest du diese Option verwenden, da sie dir ein automatisches und einfaches Deployment bietet.

- **Deployment Token**:

  - Diese Option verwendet ein **Deployment-Token**, um das Deployment manuell oder über andere Tools durchzuführen. Dies wird benutzt, wenn du z.B. nicht GitHub verwenden möchtest oder eine andere CI/CD-Pipeline hast.
  - Du würdest hier ein Token generieren und für den Zugriff auf deine App nutzen.

### 3.3. Überprüfung und Deployment starten

- Klicke auf "Überprüfen + Erstellen", und warte, bis die Validierung erfolgreich ist.
- Danach klicke auf "Erstellen", um das Deployment zu starten.

Nun solltest du in GitHub die neue Action sehen

# GitHub - Actions for Angular Project

---

[Youtub Tutorial](https://www.youtube.com/watch?v=1vqJ1_AAcUg)

- Erstelle ein Angular Project
- Erstelle ein GitHub Repo

## GitHub Setting

- Gehe zu GitHub auf dein Repo und klicke auf Tab Setting
  - Dann unter Action / General
  - Bei "Workflow permissions" soll "Read and write permissions" und "Allow GitHub Actions to create and approve pull requests" ausgewählt sein
- Nun gehen wir zum Tab "Securitiy"
  - ändere Dependabot alerts von Disabled auf Enable in dem du ein "Enable Dependabot alerts"
    - "Dependabot alerts" auf Enable
    - "Dependabot security updates" auf Enable
    - "Dependabot version updates" auf Enable
      Nun wird eine dependabot.yml erstellt. bei package-ecosystem muss für Angular noch **npm** eingestellt werden
      Danach Commite es um es zu erstellen

```Bash title:"dependabot.yml " hl:
# dependabot.yml:
# To get started with Dependabot version updates, you'll need to specify which
# package ecosystems to update and where the package manifests are located.
# Please see the documentation for all configuration options:
# https://docs.github.com/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file

version: 2
updates:
  - package-ecosystem: "npm" # See documentation for possible values
    directory: "/" # Location of package manifests
    schedule:
      interval: "weekly"
```

## GitHub Action for Testing

- Gehe zu Github Actions
- Suche nach "angular" und wähle Node.js aus
  Nun wird ein **node.js.yml** Es macht sinn den namen in etwas Passenders zu ändern. Wie z.b. **build.yml**

**zu Editieren**

```yml title:" zu Editieren" hl:
jobs:
  build:
    strategy:
      matrix:
        node-version: [22] # Deine node.js version die du in dem Projekt verwendest
	steps:
		with:
		....
		cache-dependency-path: package-lock.json
		....
	- run: npm ci
	......
	- name: Run tests
	run: npm run test:ci # Damit die Test ausgeführt werden
	- name: Build
	run: npm run build
	.....

```

```yml title:"node.js.yml / build.yml" hl:
#node.js.yml
# This workflow will do a clean installation of node dependencies, cache/restore them, build the source code and run tests across different versions of node
# For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

name: Node.js CI

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [22.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
          cache-dependency-path: package-lock.json
      - run: npm ci

      - name: Run tests
        run: npm run test:ci

      - name: Build
        run: npm run build
```

- Commit das File... die Action wird momentan noch failen
- Nun geh in Projekt zu package.json

Da die Test einen Browser brauchen müssen wir die für die CI noch hinzufügen

```json title:"package.json " hl:
"scripts": {
...
  "test:ci": "ng test --watch=false --browsers=ChromeHeadless",
...
},
```

- Commete nun das File. es Sollte jetzt durchlaufen

## GitHub Action for ng update

- Gehe in Github zum Tab "Code"
- Erstelle unter .github/workflow das fiel **ng-update.yaml**

Erklärung zum File findet man unter https://git.io/JeBz1

**ng-update.yaml**

```yml title:"ng-update.yaml " hl:
name: "Update Angular Action"
on: # when the action should run. Can also be a CRON or in response to external events. see https://git.io/JeBz1
  schedule:
    - cron: "30 5 * * 3"
  workflow_dispatch:

jobs:
  ngxUptodate:
    runs-on: ubuntu-latest
    steps:
      - name: Updating ng dependencies # the magic happens here !
        uses: fast-facts/ng-update@v1
        with:
          base-branch: main
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```
