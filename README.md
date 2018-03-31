# cubx-grunt-rename-artifact

[![Build Status](https://travis-ci.org/cubbles/cubx-grunt-rename-artifact.svg?branch=master)](https://travis-ci.org/cubbles/cubx-grunt-rename-artifact)

Grunt plugin for renaming an artifact of the current webpackage

## Usage:

### Default

Install the grunt plugin 

```
npm install cubx-grunt-rename-artifact --save-dev
```

Gruntfile

* Load the grunt plugin
    
```    
grunt.loadNpmTasks(cubx-grunt-rename-artifact)
```
        
* Set config (path to webpackage containing the artifact to be renamed) 
    
```        
grunt.initConfig({
   webpackagepath: ...
});
```

 
### Integrate in [devtools](https://github.com/cubbles/cubbles-coder-devtools): 
Just install grunt plugin
  
```
npm install cubx-grunt-rename-artifact --save
```
