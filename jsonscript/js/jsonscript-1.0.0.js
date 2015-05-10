if (!window.JSONScript) {
	window.JSONScript = (function() {
		
		/*** THOSE ARE UTILITIES ***/
		
		function undef(o) {
			return o === undefined;
		}
		
		/*** THAT'S WHERE THE CODE BEGINS ***/
		
		const keyType = "type", keyName = "name",  keyChildren = "children";
		
		const typeObject = "object", typeNumber = "number", typeString = "string", typeArray = "array", typeFunction = "function";
		
		/** Using an extra object because this looks like something enterprises use. **/
		
		var JsonBuilder = (function() {
			
			const keyValue = "value", keyRadix = "radix", keyArgs = "args", keyBody = "body";
			
			function buildObject(obj) {
				return {};
			}
			
			function buildNumber(obj) {
				var jValue = obj[keyValue], jRadix = obj[keyRadix];
				
				if (undef(jValue)) {
					console.log("A number object needs to provide a value.");
				} else {
					if (jValue.indexOf(".") > -1) {
						return parseFloat(jValue);
					} else {
						var radix = 10;
						
						if (!undef(jRadix))
							radix = parseInt(jRadix);
						
						return parseInt(jValue, jRadix);
					}
				}
			}
			
			function buildString(obj) {
				var jValue = obj[keyValue];
				
				if (undef(jValue)) {
					console.log("A string object needs to provide a value.");
				} else {
					return jValue;
				}
			}
			
			function buildArray(obj) {
				var jChildren = obj[keyChildren];
				
				if (undef(jChildren)) {
					console.log("An array object needs to provide children.");
				} else {
					var i = 0, len = jChildren.length, jArray = [];
					
					for (; i < len; jArray.push(buildByTypeName(jChildren[i++])));
					
					return jArray;
				}
				
				return null;
			}
			
			function buildFunction(obj) {
				var jArgs = obj[keyArgs], jBody = obj[keyBody];
				
				if (undef(jArgs) || undef(jBody)) {
					console.log("A function object needs to provide arguments and a body.");
				} else {
					jArgs = "\"" + jArgs.join("\",\"") + "\"";
					jBody = "\"" + jBody.join("") + "\"";
					
					return eval("new Function(" + jArgs + "," + jBody + ")");
				}
			}
			
			function buildByTypeName(currentObj) {
				var jType = currentObj[keyType];
				
				switch (jType) {
					case typeObject   : return buildObject(currentObj);
					case typeNumber   : return buildNumber(currentObj);
					case typeString   : return buildString(currentObj);
					case typeArray    : return buildArray(currentObj);
					case typeFunction : return buildFunction(currentObj);
				}
				
				return null;
			}
			
			return {
				buildByTypeName : buildByTypeName
			}
			
		})();
		
		function processChildren(jArray, scope) {
			var i = 0, len = jArray.length, currentObj, reference, jName, jType, jChildren;
			
			for (; i < len; i++) {
				currentObj = jArray[i];
				jName = currentObj[keyName];
				jType = currentObj[keyType];
				jChildren = currentObj[keyChildren];
				
				if (undef(jName) || undef(jType)) {
					console.log("Object requires at least a type and a name.");
				} else {	
					scope[jName] = JsonBuilder.buildByTypeName(currentObj);
					
					if (!undef(jChildren) && jType !== typeArray) {
						processChildren(jChildren, scope[jName]);
					}
				}
			}
		}
		
		var parse = function(jArray, scope) {
			if (undef(jArray)) {
				console.log("An object must be supplied.");
			} else {
				if (undef(scope))
					scope = window;
				
				processChildren(jArray, scope);
			}
		}
		
		return {
			parse: parse
		};
		
	})();
}