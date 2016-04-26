# Site-GamingGen
Site Web de l'association GamingGen (built on Cloud9 IDE!)

Accessible à :
```
* DEV-URL : http://site-gaminggen-darkterra.c9.io:8080/
* PROD-URL : http://darkterra.fr:3001/
```

Installation Prod (Ubuntu Server 14.04 LTS):
```
1. Install
    1. Sécuriser le Serveur
    
    2. Installer Node.JS(5.11.x) & NPM (3.x)
        - sudo apt-get install curl
        - curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
        - sudo apt-get install -y nodejs
        - sudo npm install -g npm
        * [INFO]: https://github.com/nodesource/distributions
    
    3. Installer MongoDB (3.x)
        - sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
        - echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
        - sudo apt-get update
        - sudo apt-get install -y mongodb-org
        * [INFO]: https://docs.mongodb.org/master/tutorial/install-mongodb-on-ubuntu/
    
    4. Installer StrongLoop
        - sudo npm install -g strong-pm
        - sudo sl-pm-install
        - sudo /sbin/initctl start strong-pm
        * [INFO]: https://docs.strongloop.com/display/SLC/Setting+up+a+production+host
    
    5. Installer Git
        - sudo apt-get install software-properties-common
        - sudo add-apt-repository ppa:git-core/ppa
        - sudo apt-get update
        - sudo apt-get install git

2. Configuration du serveur
    1. Ouvrir les ports (TCP):
        - 8701
        - 3000
        - 3001
    
    2. Git : (A supprimer ?)
        - git config --global color.diff auto
        - git config --global color.status auto
        - git config --global color.branch auto
        - git config --global http.postBuffer 1048576000
        
```

Installation Dev (Cloude9 - Ubuntu xx.xx LTS):
```
1. Préparation
    - Créer le Workspase (préciser le repo Github)

2. Installation
    1. Node.JS (5.11.x)
        - WIP...

    2. MongoDB (3.x)
        - WIP...
    
    3. Grunt CLI
        - npm install -g grunt-cli

3. Configuration
    1. Créer un dossier permettant d'accueil la BDD
        - mkdir data
        
    2. Créer un fichier pour démarer la BDD
        - echo 'mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"' > mongod
        - chmod a+x mongod
        - To start the Server : ./mongod
        * [INFO]: https://docs.c9.io/docs/setting-up-mongodb
      
    3. Créer un fichier pour réparer la BDD (en cas 'Unclean shutdown detected')
        - echo -e '# Only for Cloude9!\nmongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@" --repair' > mongodRepair
    
    4. Grunt & Docular
        - echo -e 'module.exports = function(grunt) {\n  // Project configuration.\n  grunt.initConfig({\n    pkg: grunt.file.readJSON("package.json"),\n    docular: {\n      groups: [],\n      showDocularDocs: true,\n      showAngularDocs: true\n    },\n\n    docularserver: {\n    targetDir: "./docular_generated",\n    port: 8080\n}\n  });\n\n  // Load the plugin that provides the "docular" tasks.\n  grunt.loadNpmTasks("grunt-docular");\n\n  // Default task(s).\n  grunt.registerTask("default", ["docular"]);\n};' > Gruntfile.js

  2. Git :
    - ajouter à .gitignore:
        # Dev Files
        *.csv
        *.dat
        *.iml
        *.log
        *.out
        *.pid
        *.seed
        *.sublime-*
        *.swo
        *.swp
        *.tgz
        *.xml
        .DS_Store
        .idea
        .project
        .strong-pm
        coverage
        
        # Configuration Cloud9 Files
        .c9
        
        # Dependency directory
        node_modules
        
        # DataBase
        data
```