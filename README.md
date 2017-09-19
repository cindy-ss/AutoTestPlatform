# Auto Test Platform

The QA Test Platform Of MLP,BJG.

--- 
How to install:  
- run `git clone` to clone this to local.
- `cd` to the folder.
- run `npm i` to install the required packages.
- run `npm start` to start the server.
You should now be able to find the platform on `http://localhost:2333`
---


Code structure:  
- Front end is developed on JQuery & BootStrap. sidebar.html is the category list.
- Server side is written in NodeJs, by express. Service is isolated as some low-level functions.
---
How to develop:  
You could fork and create pull request, and you could also apply as a contributor. Or you could just modify and send the file to me.

---
How to Use it:
--Meta Checker:可以用来导出Title,Description,OG Title,OG Description,OG Img,OG Img URL,WeChat Img,WeChat URL
![meta](https://raw.githubusercontent.com/edel-ma/AutoTestPlatform/master/Readimg/meta.png)
--Image Checker:
![image](https://raw.githubusercontent.com/edel-ma/AutoTestPlatform/master/Readimg/Image.png)
![image1](https://raw.githubusercontent.com/edel-ma/AutoTestPlatform/master/Readimg/image1.png)
--Font Checker:
![font](https://raw.githubusercontent.com/edel-ma/AutoTestPlatform/master/Readimg/Font.png)
--Link Checker:
Only Check if the links are localized  on this url page ,localization is pass ,not localization is failed.
![link](https://raw.githubusercontent.com/edel-ma/AutoTestPlatform/master/Readimg/link.png)
--Mp4 Checker:
Only list all mp4 files on this url page,url only be us link.

--V path Checker:
