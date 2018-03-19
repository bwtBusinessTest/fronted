本项目是基于vue-cli的单页面应用，安装步骤如下：

1，	安装node.js 8.9.1 ， 官网下载地址https://nodejs.org/zh-cn/，安装步骤参考http://www.runoob.com/nodejs/nodejs-install-setup.html

2，	安装Ruby（mac忽略此步），下载地址https://rubyinstaller.org/downloads/   下载Ruby2.3.3（x64）版本，安装步骤参考https://jingyan.baidu.com/article/48b558e33558ac7f38c09aee.html

3，	在附件中打开windows命令行，进入代码目录下，也就是back-manage目录下,命令如下：
例如代码在e盘下，在命令行中直接输入E:  回车进入e盘，通过cd ‘文件夹名字’进入相应的文件夹,直到进入到back-manage下

4，	执行npm install 安装依赖
npm config set registry https://registry.npm.taobao.org
set SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/

5，	如果上一步安装没有报错，执行npm run dev 等直看到Compiled successfully 代表项目成功运行，会自动打开默认浏览器（一般是ie），建议用chrome浏览器打开，在chrome中输入http://localhost:9528  即可进入系统




前端开发工具用sublime编辑器下载地址http://www.sublimetext.com/3 建议下载最新版本3134
1,破解sublime，打开Sublime菜单 > help > enter License 拷贝下面的全部内容粘贴进入即可

—– BEGIN LICENSE —– 
TwitterInc 
200 User License 
EA7E-890007 
1D77F72E 390CDD93 4DCBA022 FAF60790 
61AA12C0 A37081C5 D0316412 4584D136 
94D7F7D4 95BC8C1C 527DA828 560BB037 
D1EDDD8C AE7B379F 50C9D69D B35179EF 
2FE898C4 8E4277A8 555CE714 E1FB0E43 
D5D52613 C3D12E98 BC49967F 7652EED2 
9D2D2E61 67610860 6D338B72 5CF95C69 
E36B85CC 84991F19 7575D828 470A92AB 
—— END LICENSE ——

2，安装vue文件语法高亮插件,打开sublime编辑器，按Ctrl+` 调出console 粘贴以下代码到底部命令行并回车：
import urllib.request,os; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); open(os.path.join(ipp, pf), 'wb').write(urllib.request.urlopen( 'http://sublime.wbond.net/'  + pf.replace(' ',' ')).read())

3，重启sublime

4，按下Ctrl+Shift+P调出命令面板 输入install调出Install Package 选项并回车 输入vue
   在下面找到vue Syntax Highlight 回车安装即可，下次打开即可看到语法高亮


 提交代码注意事项：node_modules
 下的所有文件都不要提交，这是开发时的依赖包很大严重影响上传下载速度






