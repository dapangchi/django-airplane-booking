/**
 * Angular adapter
 */

(function () {

"use strict";

var ngWebUIPopoverModule = angular.module('webUI', []);
ngWebUIPopoverModule.directive('wuiPopover', [
'$templateRequest', '$sce', '$q', '$compile', '$timeout',

function ($templateRequest, $sce, $q, $compile, $timeout) {
console.log('popover1');
var controller = ['$scope', function ($scope) {
}];

function ngWebUIPopoverLink (scope, elem, attrs, selfCtrl, transcludeFn) {
	var newScope = null;
	var newClone = null;
	var template = null;

	var compileContainer = angular.element('<span class="hidden"></span>').appendTo(elem);

	function appendAndCompileTemplate () {
		var contentElement = elem.webuiPopover('getContentElement')[0];

		newScope = scope.$new();
		compileContainer.html(template);

		// compile template in the compiler container
		// BEFORE moving the new template element to the popover contentElement
		// to give the template directives access to wuiPopover controller
		newClone = $compile(compileContainer.contents())(newScope);

		$timeout(function () {
			contentElement.append(newClone);
		});
	};

	function initialize () {
		var initializeTemplate = function () {
			appendAndCompileTemplate();
			elem.off('shown.webui.popover', initializeTemplate);
		}
		elem.webuiPopover(scope.options);
		elem.on('shown.webui.popover', initializeTemplate);
	};

	function cleanup () {
		elem.webuiPopover('destroy');
		elem.off('show.webui.popover');

		if (newScope) {
			newScope.$destroy();
			newScope = null;
		}

		if (newClone) {
			newClone.remove();
			newClone = null;
		}
	};

	scope.call = selfCtrl.call = function () {
		elem.webuiPopover.apply(elem, arguments);
	};

	scope.closePopover = selfCtrl.closePopover = function () {
		elem.webuiPopover('hide');
	};

	scope.$on('$destroy', cleanup);

	(function () {
		if (!scope.options) {
			scope.options = {
				title: null,
				content: null,
				placement: null,
				extraClass: null,
			};
		}

		scope.options.title = scope.title || scope.options.title;
		scope.options.content = scope.content || scope.options.content;
		scope.options.placement = scope.placement || scope.options.placement;
		scope.options.extraClass = scope.extraClass || scope.options.extraClass || '';
		scope.options.backdrop = scope.backdrop || scope.options.backdrop || false;

		if (scope.templateUrl) {
			var src = scope.templateUrl;

			$templateRequest(src, true).then(function (template_) {
				template = template_;
				initialize();
			});
		} else {
			initialize();
		}
	})();
};
console.log('popover2');

return {
	restrict: 'A',
	require: 'wuiPopover',
	scope: {
		options: '=?wuiOptions',
		title: '=?wuiTitle',
		content: '=?wuiContent',
		placement: '=?wuiPlacement',
		templateUrl: '=?wuiTemplate',
		extraClass: '@wuiClass',
		backdrop: '=?wuiBackdrop',
	},
	controller: controller,
	link: ngWebUIPopoverLink,
};

}]);

})();
