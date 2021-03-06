//-------------------------------------------------------------
// 获取全局公用元素
var header = tool.$('header'); //页眉

var wrapFiles = tool.$('#file-container'); //文件内容区

var arrFile = wrapFiles.children; //文件内容区的 子元素集合

var wrapFeature = tool.$('.feature'); //功能按键面板

var wrapSideBar = tool.$('.side-bar');//侧边栏

var wrapActiveWindow = tool.$('.active-window'); //侧边栏目录树活动窗

var allChecked = tool.$('.all-in'); //全选框

// -------------------------------------------------------------
//获取数据
var data = user_data.files; //数据 根目录

var currentData = data[0].children; //当前页面显示的文件的数据（初始化为根目录）

var currentDataId = 0; //当前数据的Id

var clipBoard = new Array(); //剪贴板

// -------------------------------------------------------------
//初始化页面
function initHtml() {
  var catalogSidebar = tool.$('.tree-menu', wrapActiveWindow); //目录树根目录列表

  wrapFiles.innerHTML = createFileHtml(currentData);
  catalogSidebar.innerHTML = createCatalogTree(data);

  addFileEvent();
  catalogEvent();
  eventAllChecked();
  eventFileExist();
}
initHtml();

//创建文件内容区的HTML结构
function createFileHtml(data) {
  var str = ``,
    i, len = data.length;

  for (var i = 0; i < len; i++) {
    str += `<div class="file" data-id="${data[i].id}">
              <div class="file-panel">
                <span class="file-checkbox"></span>
                <span class="file-delete"></span>
                <span class="file-rename"></span>
              </div>
              <div class="file-img ${'file-type-' + data[i].type}"></div>
              <div class="file-info" title="${data[i].name}">${data[i].name}</div>
              <input class="file-rename-text" type="text" value="${data[i].name}" spellcheck="false">
              <time class="file-time">${data[i].time}</time>
            </div>`
  }
  return str;
}

//生成侧边栏目录树
function createCatalogTree(data) {
  var str = ``,
    cls;

  Array.from(data).forEach(function(item, i) {

    str += `<li><span class="${cls = !!item.children[0] ? 'open':''}"></span><a class="${'catalog-file-' + item.type}" href="javascript:;" data-id="${item.id}" data-type="${item.type}">${item.name}</a>`;
    if (item.children) {
      str += '<ul>' + createCatalogTree(item.children) + '</ul>';
    }
    str += `</li>`;
  })
  return str;
}

// 遍历当前页面显示的所有文件夹
function addFileEvent() {
  Array.from(arrFile).forEach(function(item) {

    var itemPanel = tool.$('.file-panel', item);

    item.onmouseover = function() {
      itemPanel.style.opacity = '1';
    }

    item.onmouseout = function() {
      itemPanel.style.opacity = '';
    }
  });
}

//生成目录结构
function catalogEvent() {
  var catalog = tool.$('.catalog'); //目录栏
  var arrCatalog = tool.$('a', catalog);
  for (var i = 0; i < arrCatalog.length; i++) {
    arrCatalog[i].index = i;
    arrCatalog[i].onclick = function() {
      fileClick(arrCatalog[this.index].dataset.id);
      var fileClickId = arrCatalog[this.index].dataset.id * 1;
      if (!fileClickId) {
        catalog.innerHTML = 'Root';
      }
    }
  }
}

//判断当前文档是否有文件
function eventFileExist() {
  currentData.length ? wrapFiles.classList.remove('active') : wrapFiles.classList.add('active');
}

//判断当前显示数据是否全选
function isAllChecked() {
  var isChecked = false,
    checkedNum = currentData.length;
  for (var i = 0; i < currentData.length; i++) {
    currentData[i].checked ? checkedNum-- : checkedNum++;
  }
  isChecked = !checkedNum ? true : false;

  return isChecked;
}

//全选转换事件
function eventAllChecked() {
  if (!currentData.length) {
    allChecked.classList.remove('active');
    return;
  }
  if (isAllChecked()) {
    allChecked.classList.add('active');
  } else {
    allChecked.classList.remove('active');
  }
}

// 通过id获取对应数据
function getItemDataById(data, id) {

  var current = null,
    i, len = data.length;

  for (var i = 0; i < len; i++) {
    if (data[i].id === id) {
      current = data[i];
      break;
    }
    if (!current && data[i].children.length) {
      current = getItemDataById(data[i].children, id);
      if (current) break;
    }
  }
  return current;
}

// 通过id获取对应祖先数据
function getParentsById(data, id) {
  if (typeof id === 'undefined') return;

  var arr = [];

  var current = getItemDataById(data, id);

  arr.push(current);

  arr = arr.concat(getParentsById(data, current.pId));

  return arr;
}

// 通过id获取对应子孙数据
function getChildrenById(data, id){
  if (typeof id === 'undefined') return;

  var arr = [];

  var current = getItemDataById(data, id);

  arr.push(current);

  var currentChildren = current.children;

  if (current.children.length) {
    for (var i = 0; i < currentChildren.length; i++) {

    if (currentChildren[i].children) {
      arr = arr.concat(getChildrenById(data,currentChildren[i].id));
    }
   }
  }
  
  return arr;
}