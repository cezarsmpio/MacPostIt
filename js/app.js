var app = angular.module('PostItApp', []);

/**
 * Controllers
 */
app.controller('PostItController', function ($scope, $window) {
	/**
	 * Models
	 */
	// Armazenar os postits
	$scope.posts = [];

	// Cores disponíveis para escolha
	// Cada cor é uma classe no CSS
	$scope.colors = [
		'yellow',
		'orange',
		'green-light',
		'green',
		'blue-green',
		'blue',
		'purple',
		'pink',
		'white',
		'grey'
	];

	// Font families disponíveis
	// Cada valor deverá corresponder ao um font-family
	$scope.fonts = [
		'Arial',
		'Century Gothic',
		'Comic Sans MS',
		'Courier New',
		'Georgia',
		'Helvetica',
		'Impact'
	];

	// Os tamnhos de font-size disponíveis
	$scope.sizes = [10, 11, 12, 14, 16, 18, 20, 22, 26];

	// Irá adicionar novos postits na model 'posts'
	$scope.newPostIt = function () {
		$scope.posts.push({
			text: '',
			color: 'yellow',
			isFlipped: false,
			left: 30,
			top: 30,
			font: {
				family: 'Helvetica',
				size: 14
			}
		});
	};

	// Salva o post-it em localStorage
	$scope.savePostIt = function () {
		localStorage.setItem('postits', JSON.stringify($scope.posts));
	}

	// Retorna os postits salvos em localstorage
	// se não for encontrado retorna uma array []
	$scope.getPostIts = function () {
		return JSON.parse(localStorage.getItem('postits')) || [];
	}

	// Apaga todos os postits do escopo
	$scope.clearPostIts = function () {
		$scope.posts = [];
	}

	// O método $watch fica 'escutando' o escopo posts
	// Qualquer alteração ele salvará em localstorage
	$scope.$watch('posts', function () {
		$scope.savePostIt();
	}, true);
});

/**
 * Diretiva para movimentar os postits com drag
 */
app.directive('draggable', ['$document', function ($document) {
	return {
		restrict: 'A',
		link: function (scope, el, attrs) {
			var startX, startY, initialMouseX, initialMouseY;

			el.bind('mousedown', function($event) {
				startX = el.prop('offsetLeft');
				startY = el.prop('offsetTop');
				initialMouseX = $event.clientX;
				initialMouseY = $event.clientY;
				$document.bind('mousemove', mousemove);
				$document.bind('mouseup', mouseup);

				angular.element(document.querySelectorAll('.postit')).removeClass('postit-visible');

				el.addClass('postit-visible');

				return false;
			});

			function mousemove ($event) {
				var dx = $event.clientX - initialMouseX,
					dy = $event.clientY - initialMouseY;

				el.addClass('postit-grabbing');

				// Altera os valores do element no escopo
				// Como angular é TwoWay Data Binding
				// Isso se refletirá no html
				scope.$apply(function() {
					scope.p.left = startX + dx;
					scope.p.top = startY + dy;
				});

				return false;
			}

			function mouseup () {
				$document.unbind('mousemove', mousemove);
				$document.unbind('mouseup', mouseup);

				el.removeClass('postit-grabbing');
			}
		}
	};
}]);
