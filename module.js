var Module = (function() {
    var modules = {};
    
    return {
        
        options : {
            baseDir : "/js/",
            cssBaseDir : "/css/"
        },
    
        define : function() {
            var dependencies = [];
            var callback = undefined;
            
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] == 'string') {
                    dependencies.push(arguments[i]);
                }
                if (typeof arguments[i] == "function") {
                    callback = arguments[i];
                }
            }
            
        	dependencies.forEach(function(dep) {
        		if (modules[dep] === undefined) {
        		    modules[dep] = {};
        		}
        	});
        	
        	return callback.apply(window, dependencies.map(function(dep) {
                return modules[dep];
            }));
        	
        },
        
        importStatic : function(scriptFilename, fn) {
        	
        	var script = document.createElement('script');
        	script.type = 'text/javascript';
        	script.onreadystatechange = function() {
        		if (this.readyState == 'complete') {
        			fn();
        		}
        	};
        	script.onload = function() {
        		fn();
        	};
        	script.src = this.options.baseDir + scriptFilename + '.js';
        	
        	document.getElementsByTagName('head')[0].appendChild(script);
        		
        },
        
        importCss : function(cssFilename) {
            var styleElement = document.createElement('link');
            styleElement.type = 'text/css';
            styleElement.href = this.options.cssBaseDir + cssFilename + '.css';
            styleElement.rel = 'stylesheet';
            document.getElementsByTagName('head')[0].appendChild(styleElement);
        },
        
        importTemplate: function(filename) {
            var template = undefined;
            $.ajax({
                url : this.options.baseDir + filename + '.html',
                method : "GET",
                datatype : "text",
                dataFilter : function(data, type) {
                    return data;
                },
                async : false,
            }).done(function(templateFile) {
                template = templateFile;
            });
            return template;
        },
        
        load : function() {
            
            var dependencies = [];
            var deferreds = [];
            var callback = undefined;
            var self = this;
            
            function loadModules() {
                deferreds = [];
                getKeysAsArray(modules).forEach(function(scriptFilename) {
                    if (getKeysAsArray(modules[scriptFilename]).length == 0) {
                        deferreds.push(
                            $.ajax({
                                url : self.options.baseDir + scriptFilename + '.js',
                                method : "GET", 
                                data : {},
                                datatype : "text",
                                dataFilter : function(data, type) {
                                    return data;
                                },
                            }).done(function(js) {
                                $.extend(modules[scriptFilename], eval(js));
                            }).fail(function(err1, err2, err3) {
                                console.error(scriptFilename + ":" + err2); 
                            })
                        );
                    }
                });
                
                if (deferreds.length > 0) {
                    $.when.apply(null, deferreds).then(loadModules);
                } else {
                    callback.apply(null, dependencies.map(function(dep) {
                        return modules[dep];
                    }));
                }
            }
        	
        	for (var i = 0; i < arguments.length; i++) {
        		if (typeof arguments[i] == 'string') {
        			dependencies.push(arguments[i]);
        		}
        		if (typeof arguments[i] == "function") {
        			callback = arguments[i];
        		}
        	}
        	
        	if (callback === undefined) {
        		throw "No main function defined";
        	}
        	
        	dependencies.forEach(function(scriptFilename) {
        		if (modules[scriptFilename] === undefined) {
        			modules[scriptFilename] = {};
        		}
        	});
        
        	loadModules();
        }
    };
})();
