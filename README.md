# grunt-img-md5

> The best Grunt plugin ever.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-img-md5 --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-img-md5');
```

## The "img_md5" task

### Overview
In your project's Gruntfile, add a section named `img_md5` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  img_md5: {
    options: {
      // Task-specific options go here.
    },
    files: {
      // Target-specific file lists and/or options go here.
    },
    map: function(filename){ 
      // new fileName
    }
  },
});
```

### Options

#### options.Base
Type: `String`
Default value: `',  '`

process gets img absolute path according to options.Base and img's url

#### options.Target
Type: `String`
Default value: `'.'`

process write img according to options.Target and img's url

#### options.RegExp
Type: `Array(RegExp)`
Default value: null

this plugin matches 'src="../img/a.png"' and 'url(..img/a.png)' in defalut config,you can add More RexExp which can 
return a Array and Array[1] is img's url 

#### function map

return new file path

### Usage Examples

```js
grunt.initConfig({
  img_md5: {
    html: {
        options:{
          Base:'md5Src/html/', //会根据Base,匹配出来的图片url来确定源图片文件的url
          Target:"md5Src/html/", //会根据Target,匹配出来的图片url来确定新图片文件的url
          RegExp:[/data-url\s*=\s*["']([^<">']+?\.(jpg|png|gif))/g] //额外的正则表达式匹配，期望返回类似["anything","../img/a.png"]类的结果
        },
        files: {
          'html/': 'html/*.html'
        },
        map: function(filename){ 
          var newfilename = filename.replace('html/',"html/"); //返回新的html文件的地址
          return newfilename;
        }
      },
  },
});
```

```js
grunt.initConfig({
  img_md5: {
    html: {
        options:{
          BaseMap: function (v) {
            return path.join('md5Src/html/',v); //v is img's url ,you shuold return the src img path
          },
          TargetMap:function (v) {
            return path.join('md5Src/html/',v); //v is img's url ,you shuold return the dest img path
          }
        },
        files: {
          'html/': 'html/*.html'
        },
        map: function(filename){ //
          var newfilename = filename.replace('html/',"html/");
          return newfilename;
        }
      },
  },
});
```

##test

run

```js
npm run test
```
you can see release folder build in test folder

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
