function Tab(title, path){
   this.title = title; 
   this.path = path;
}

Tab.prototype.isActive = function(activePath){
   return activePath == this.path; 
};

module.exports = Tab;