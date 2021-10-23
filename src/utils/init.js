
export default () => {
	Date.prototype.Format = function(fmt){
	  var o = {   
	    "M+" : this.getMonth()+1,                 
	    "d+" : this.getDate(), 
	    "h+" : this.getHours(), 
	    "m+" : this.getMinutes(),  
	    "s+" : this.getSeconds(),    
	    "q+" : Math.floor((this.getMonth()+3)/3), 
	    "S"  : this.getMilliseconds() 
	  };   
	  if(/(y+)/.test(fmt))   
	    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
	  for(var k in o)   
	    if(new RegExp("("+ k +")").test(fmt))   
	  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
	  return fmt;
	},

	String.prototype.parseTime = function(){
		var now = new Date();
		let timeStr = this;
		if (!timeStr)
			return now.Format('hh:mm');
		timeStr += '';
		timeStr = timeStr.replace(/\D/g, '');
		if (!timeStr)
			return now.Format('hh:mm');
		if (timeStr.length > 4){
			timeStr = timeStr.substr(0, 4);
		}
		var h = '', m = '';
		if (timeStr.length == 4){
			h = parseInt(timeStr.substr(0,2));
			m = parseInt(timeStr.substr(2,2));
		} else if (timeStr.length == 3){
			h = parseInt(timeStr.substr(0,1));
			m = parseInt(timeStr.substr(1,2));
		} else if (timeStr.length == 2){
			h = parseInt(timeStr.substr(0,2));
			m = 0;
		} else {
			h = now.Format('hh');
			m = now.Format('mm');
		}
		h = h % 24;
		m = m % 60;
		if (h < 10)
			h = '0' + h;
		if (m < 10)
			m = '0' + m;
		return h + ':' + m;
	}

	if (!Math.uuid) {
		Math.uuid = function() { 
		    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { 
		        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); 
		        return v.toString(16); 
		    }).replace(/-/g, '');
		}
	}
}