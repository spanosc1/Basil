$(document).ready(function() {
	//Loads menu
	var menu;
	var currentURL = window.location.origin;
	$.ajax({url: currentURL + "/order/menu", method: "GET"})
		.done(function(result) {
			console.log(result);
			menu = result;
		});
	//Order object to be sent to POS
	var order = [];
	//Object constructor for a pizza
	var pizza = {
	  type: "",
	  size: "",
	  toppings: [],
	  toppingsLeft: [],
	  toppingsRight: [],
	  cooked: "",
	  comment: ""
	};
	var steak = {
		type: "",
		cooked: "",
		toppings: [],
		comment: ""
	};
	var pasta = {
		type: "",
		toppings: [],
		sauce: "",
		comment: ""
	};
	var entree = {
		type: "",
		side: "",
		sideExtra: [],
	}
	//Current item being customized.  Used when the user clicks away to a different item
	var currentItem;
	//Whether or not the item has been customized, Boolean
	var changed;
	//Results from the form
	var Form = [];
	//Array of values of checked boxes.  The first 2 values are size and crust type respectively 
	var Checked =[];
	//How much extra for each topping (light, extra, xxtra), corresponds with checked array with offset of 2, for size and crust
	var Amounts = [];
	//What part of pizza to place toppings (left, right, all), corresponds with checked array with offset of 2, for size and crust
	var Placements = [];
	//Function to add the current customized item to users order
	$("#addPizzaButton").on("click", function(){
		//Grabs the input from the entire form and puts it into the form array
		$('form').each(function(){
	    Form.push($(this).find(':input'));
		});
		console.log(Form[0]);
		//Iterates through form results
		for(var i = 0; i < Form[0].length; i++)
		{
			//If the item is checked (also only takes fields with checkboxes, not dropdowns)
			if(Form[0][i].checked)
			{
				//Push the value onto the checked array (value is size, crust, then toppings)
				Checked.push(Form[0][i].value);
				//Start at 6th since 0 through 5 are used for 3 sizes and 3 crusts.  102 is the end of the toppings choices
				if(i > 5 && i < 102)
				{
					/*Each topping has 4 fields: left, all, right, and extra.  If the left box is checked,
					  the extra position for that topping is 3 spaces offset in the form array.  All
					  is offset by 2, and right by 1.  Therefore when populating the Placements and
					  Ammounts array, we must offset i
					*/
					if(Form[0][i].attributes.where.value == "left")
					{
						Amounts.push(Form[0][i+3].value);
						Placements.push("left");
					}
					else if(Form[0][i].attributes.where.value == "all")
					{
						Amounts.push(Form[0][i+2].value);
						Placements.push("all");
					}
					else if(Form[0][i].attributes.where.value == "right")
					{
						Amounts.push(Form[0][i+1].value);
						Placements.push("right");
					}
				}
			}
		}
		//Populates the appropriate arrays in the pizza object with the amounts and the topping name
		//j + 2 is necessary because the first 2 positions in Checked are size and crust
		for(var j = 0; j < Placements.length; j++)
		{
			if(Placements[j] == "left")
			{
				if(Amounts[j] != "normal")
				{
					pizza.toppingsLeft.push(Amounts[j] + " " + Checked[j + 2]);
				}
				else
				{
					pizza.toppingsLeft.push(Checked[j + 2]);
				}
			}
			else if(Placements[j] == "right")
			{
				if(Amounts[j] != "normal")
				{
					pizza.toppingsRight.push(Amounts[j] + " " + Checked[j + 2]);
				}
				else
				{
					pizza.toppingsRight.push(Checked[j + 2]);
				}
			}
			else
			{
				if(Amounts[j] != "normal")
				{
					pizza.toppings.push(Amounts[j] + " " + Checked[j + 2]);
				}
				else
				{
					pizza.toppings.push(Checked[j + 2]);
				}
			}
		}
		//Pizza size and crust type
		pizza.size = Checked[0];
		pizza.crust = Checked[1];
		//The method of cooking is determined as the last position in the checked array after toppings
		var numToppings = pizza.toppingsLeft.length + pizza.toppings.length + pizza.toppingsRight.length;
		//Check if null because special cooking method is not always specified
		if(Checked[numToppings + 2] != null)
		{
			pizza.cooked = Checked[numToppings + 2];
		}
		//Comment is always 179th in the form
		pizza.comment = Form[0][179].value
		order.push(pizza);
		var html = '<div class="card card-block"><h4 class="card-title">' + pizza.type + '</h4><p class="card-text">' + menu.pizza[pizza.type].price + '</p><a href="#" onClick="removeItem" class="btn btn-primary">Remove</a></div>';
		$("#yourOrder").append(html);
		console.log(pizza);
		Form.length = 0;
		pizza.toppings.length = 0;
		pizza.toppingsLeft.length = 0;
		pizza.toppingsRight.length = 0;
		Checked.length = 0;
		Amounts.length = 0;
		Placements.length = 0;
		changed = false;
	});
	//Set the type of pizza selected by the user
	$(".pizzaType").on('click', function() {
		SetOptions("#optionsPizza");
		currentItem = $(this).get(0).attributes[3].value;
		pizza.type = currentItem;
		$(".thisItem").text(currentItem);
		var defaultToppings = menu.pizza[currentItem].toppings;
		$(".form-control").val("normal");
		$("#commentPizza").val("");
		$("#numPizza").val("1");
		$('#uniqueToppings').empty();
		$('#regularToppings').empty();
		$('#specialtyToppings').empty();
		$('#sauceCheese').empty();
		for(var i = 0; i < defaultToppings.length; i++)
		{
			var toppingHTML = '<tr>'
							  + '<td>' + defaultToppings[i] + '</td>'
							  + '<td>'
							  +  	'<label class="checkbox-inline">'
								+    		'<input type="checkbox" class="radio" value="' + defaultToppings[i] + '" where="left" name="' + defaultToppings[i] + '" /></label>'
								+    	'<label class="checkbox-inline">'
								+		    '<input type="checkbox" class="radio" value="' + defaultToppings[i] + '" where="all" name="' + defaultToppings[i] + '" /></label>'
								+		  '<label class="checkbox-inline">'
								+		    '<input type="checkbox" class="radio" value="' + defaultToppings[i] + '" where="right" name="' + defaultToppings[i] + '" /></label>'
								+    '</td>'
								+    '<td>'
								+   		'<select class="form-control" id="amount' + defaultToppings[i] + '">'
								+				'<option value="normal">Normal</option>'
								+			  '<option value="light">Light</option>'
								+			  '<option value="extra">Extra</option>'
								+			  '<option value="xxtra">Xxtra</option>'
								+			  '<option value="side">Side</option>'
								+			'</select>'
								+  	'</td>'
							  + '</tr>';
			$('#uniqueToppings').append(toppingHTML);
		}
		for(var i = 0; i < menu.pizza.toppings.length; i++)
		{
			if(contains(menu.pizza.toppings[i], defaultToppings))
			{
				var toppingHTML = '<tr>'
								  +    '<td>' + menu.pizza.toppings[i] + '</td>'
								  +    '<td>'
								  +    '<label class="checkbox-inline">'
									+    		'<input type="checkbox" class="radio" value="' + menu.pizza.toppings[i] + '" where="left" name="' + menu.pizza.toppings[i] + '" /></label>'
									+    '<label class="checkbox-inline">'
									+		    '<input type="checkbox" class="radio" value="' + menu.pizza.toppings[i] + '" where="all" name="' + menu.pizza.toppings[i] + '" /></label>'
									+		 '<label class="checkbox-inline">'
									+		    '<input type="checkbox" class="radio" value="' + menu.pizza.toppings[i] + '" where="right" name="' + menu.pizza.toppings[i] + '" /></label>'
									+    '</td>'
									+    '<td>'
									+   	'<select class="form-control" id="amount' + menu.pizza.toppings[i] + '">'
									+			'<option value="normal">Normal</option>'
									+			'<option value="light">Light</option>'
									+			'<option value="extra">Extra</option>'
									+			'<option value="xxtra">Xxtra</option>'
									+			'<option value="side">Side</option>'
									+		'</select>'
									+   '</td>'
								  +  '</tr>';
				if(menu.pizza.toppingsPrices[menu.pizza.toppings[i]] == 3.00)
				{
					$('#regularToppings').append(toppingHTML);
				}
				else if(menu.pizza.toppingsPrices[menu.pizza.toppings[i]] == 4.00)
				{
					$('#specialtyToppings').append(toppingHTML);
				}
				else
				{
					$('#sauceCheese').append(toppingHTML);
				}
			}
		}
		$(':input[type="checkbox"]').prop("checked", false);
		for(var i = 0; i < defaultToppings.length; i++)
		{
			$(':input[value="' + defaultToppings[i] + '"][where="all"]').prop("checked", true);
		}
	});
	//Set the type of steak selected by the user
	$(".steakType").on('click', function() {
		SetOptions("#optionsSteak");
		currentItem = $(this).get(0).attributes[3].value;
		steak.type = currentItem;
		$(".thisItem").text(currentItem);
		var defaultToppings = menu.cheesesteak[currentItem].toppings;
		$(".form-control").val("normal");
		$("#commentSteak").val("");
		$("#numSteak").val("1");
		$('#uniqueToppingsSteak').empty();
		$('#regularToppingsSteak').empty();
		for(var i = 0; i < defaultToppings.length; i++)
		{
			var toppingHTML = '<tr>'
								+ '<td>' + defaultToppings[i] + '</td>'
							  +   '<td>'
							  +    	'<label class="checkbox-inline">'
								+    		'<input type="checkbox" class="radio" value="' + defaultToppings[i] + '" name="' + defaultToppings[i] + '" /></label>'
								+    '</td>'
								+   	'<td>'
								+   		'<select class="form-control" id="amount ' + defaultToppings[i] + '">'
								+				'<option value="normal">Normal</option>'
								+			  '<option value="light">Light</option>'
								+			  '<option value="extra">Extra</option>'
								+			  '<option value="xxtra">Xxtra</option>'
								+			  '<option value="side">Side</option>'
								+			'</select>'
								+   	'</td>'
							  +  '</tr>';
			$('#uniqueToppingsSteak').append(toppingHTML);
		}
		for(var i = 0; i < menu.cheesesteak.toppings.length; i++)
		{
			if(contains(menu.cheesesteak.toppings[i], defaultToppings))
			{
				var toppingHTML = '<tr>'
									+ '<td>' + menu.cheesesteak.toppings[i] + '</td>'
								  +   '<td>'
								  +    	'<label class="checkbox-inline">'
									+    		'<input type="checkbox" class="radio" value="' + menu.cheesesteak.toppings[i] + '" name="' + menu.cheesesteak.toppings[i] + '" /></label>'
									+    '</td>'
									+   	'<td>'
									+   		'<select class="form-control" id="amount ' + menu.cheesesteak.toppings[i] + '">'
									+				'<option value="normal">Normal</option>'
									+			  '<option value="light">Light</option>'
									+			  '<option value="extra">Extra</option>'
									+			  '<option value="xxtra">Xxtra</option>'
									+			  '<option value="side">Side</option>'
									+			'</select>'
									+   	'</td>'
								  +  '</tr>';
				$('#regularToppingsSteak').append(toppingHTML);
			}
		}
		for(var i = 0; i < defaultToppings.length; i++)
		{
			$(':input[value="' + defaultToppings[i] + '"]').prop("checked", true);
		}
	});
	$(".pastaType").on('click', function() {
		SetOptions("#optionsPasta");
		currentItem = $(this).get(0).attributes[3].value;
		pasta.type = currentItem;
		$(".thisItem").text(currentItem);
		$('#saucePasta').empty();
		var defaultSauce = menu.pasta[currentItem].sauce[0];
		$(".form-control").val("normal");
		$("#commentPasta").val("");
		$("#numPasta").val("1");
		$('#toppingsPasta').empty();
		for(var i = 0; i < menu.pasta.details.length; i++)
		{
			var toppingHTML = '<tr>'
							+ '<td>' + menu.pasta.details[i] + '</td>'
						  +   '<td>'
						  +    	'<label class="checkbox-inline">'
							+    		'<input type="checkbox" class="radio" value="' + menu.pasta.details[i] + '" name="' + menu.pasta.details[i] + '" /></label>'
							+    '</td>'
							+   	'<td>'
							+   		'<select class="form-control" id="amount ' + menu.pasta.details[i] + '">'
							+				'<option value="normal">Normal</option>'
							+			  '<option value="light">Light</option>'
							+			  '<option value="extra">Extra</option>'
							+			  '<option value="xxtra">Xxtra</option>'
							+			  '<option value="side">Side</option>'
							+			'</select>'
							+   	'</td>'
						  +  '</tr>';
			$("#toppingsPasta").append(toppingHTML);
		}
		if(menu.pasta[currentItem].details.length > 0)
		{
			$(':input[value="' + menu.pasta[currentItem].details[0] + '"]').prop("checked", true);
		}
		if(defaultSauce)
		{
			var toppingHTML = '<tr>'
								+ '<td>' + defaultSauce + '</td>'
							  +   '<td>'
							  +    	'<label class="checkbox-inline">'
								+    		'<input type="checkbox" checked="true" class="radio" value="' + defaultSauce + '" name="' + defaultSauce + '" /></label>'
								+    '</td>'
								+   	'<td>'
								+   		'<select class="form-control" id="amount ' + defaultSauce + '">'
								+				'<option value="normal">Normal</option>'
								+			  '<option value="light">Light</option>'
								+			  '<option value="extra">Extra</option>'
								+			  '<option value="xxtra">Xxtra</option>'
								+			  '<option value="side">Side</option>'
								+			'</select>'
								+   	'</td>'
							  +  '</tr>';
			$('#saucePasta').append(toppingHTML);
		}
		if(menu.pasta[currentItem].sauce.length > 1)
		{
			var toppingHTML = '<tr>'
							+ '<td>' + menu.pasta[currentItem].sauce[1] + '</td>'
						  +   '<td>'
						  +    	'<label class="checkbox-inline">'
							+    		'<input type="checkbox" class="radio" value="' + menu.pasta[currentItem].sauce[1] + '" name="' + defaultSauce + '" /></label>'
							+    '</td>'
							+   	'<td>'
							+   		'<select class="form-control" id="amount ' + menu.pasta[currentItem].sauce[1] + '">'
							+				'<option value="normal">Normal</option>'
							+			  '<option value="light">Light</option>'
							+			  '<option value="extra">Extra</option>'
							+			  '<option value="xxtra">Xxtra</option>'
							+			  '<option value="side">Side</option>'
							+			'</select>'
							+   	'</td>'
						  +  '</tr>';
			$('#saucePasta').append(toppingHTML);
		}
	});
	$(".entreeType").on('click', function() {
		SetOptions("#optionsEntree");
		currentItem = $(this).get(0).attributes[3].value;
		console.log(currentItem);
		entree.type = currentItem;
		$(".thisItem").text(currentItem);
		$("#ingredient").empty();
		$("#dressing").empty();
		$(".form-control").val("normal");
		$("#commentEntree").val("");
		$("#numEntree").val("1");
		for(var i = 0; i < menu.entrees[currentItem].ingredients.length; i++)
		{
			var toppingHTML = '<tr>'
								+ '<td>' + menu.entrees[currentItem].ingredients[i] + '</td>'
							  +   '<td>'
							  +    	'<label class="checkbox-inline">'
								+    		'<input type="checkbox" class="radio" checked="true" value="' + menu.entrees[currentItem].ingredients[i] + '" name="' + menu.entrees[currentItem].ingredients[i] + '" /></label>'
								+    '</td>'
								+   	'<td>'
								+   		'<select class="form-control" id="amount ' + menu.entrees[currentItem].ingredients[i] + '">'
								+				'<option value="normal">Normal</option>'
								+			  '<option value="light">Light</option>'
								+			  '<option value="extra">Extra</option>'
								+			  '<option value="xxtra">Xxtra</option>'
								+			  '<option value="side">Side</option>'
								+			'</select>'
								+   	'</td>'
							  +  '</tr>';
			$('#ingredient').append(toppingHTML);
		}
		for(var i = 0; i < menu.entrees.meat.length; i++)
		{
			var toppingHTML = '<tr>'
								+ '<td>' + menu.entrees[currentItem].ingredients[i] + '</td>'
							  +   '<td>'
							  +    	'<label class="checkbox-inline">'
								+    		'<input type="checkbox" class="radio" checked="true" value="' + menu.entrees[currentItem].ingredients[i] + '" name="' + menu.entrees[currentItem].ingredients[i] + '" /></label>'
								+    '</td>'
								+   	'<td>'
								+   		'<select class="form-control" id="amount ' + menu.entrees[currentItem].ingredients[i] + '">'
								+				'<option value="normal">Normal</option>'
								+			  '<option value="light">Light</option>'
								+			  '<option value="extra">Extra</option>'
								+			  '<option value="xxtra">Xxtra</option>'
								+			  '<option value="side">Side</option>'
								+			'</select>'
								+   	'</td>'
							  +  '</tr>';
			$('#ingredientMeat').append(toppingHTML);
		}
		for(var i = 0; i < menu.entrees.dressing.length; i++)
		{
			var toppingHTML = '<tr>'
								+ '<td>' + menu.entrees.dressing[i] + '</td>'
							  +   '<td>'
							  +    	'<label class="checkbox-inline">'
								+    		'<input type="checkbox" class="radio" value="' + menu.entrees.dressing[i] + '" name="' + menu.entrees.dressing[i] + '" /></label>'
								+    '</td>'
								+   	'<td>'
								+   		'<select class="form-control" id="amount ' + menu.entrees.dressing[i] + '">'
								+				'<option value="normal">Normal</option>'
								+			  '<option value="light">Light</option>'
								+			  '<option value="extra">Extra</option>'
								+			  '<option value="xxtra">Xxtra</option>'
								+			  '<option value="side">Side</option>'
								+			'</select>'
								+   	'</td>'
							  +  '</tr>';
			$('#dressing').append(toppingHTML);
		}
	});
	//Unchecks checkboxes in same name group if another is selected (ex. user picks left pepperoni, then changes to all)
	$('#masterFormDiv').on('click', 'input:checkbox', function() {
		console.log("happened");
	  var $box = $(this);
	  if ($box.is(":checked")) {
	    var group = "input:checkbox[name='" + $box.attr("name") + "']";
	    $(group).prop("checked", false);
	    $box.prop("checked", true);
	  }
	  else {
	    $box.prop("checked", false);
	  }
	  changed = true;
	});
	function SetOptions(option) {
		$('#optionsPizza').addClass('hidden');
		$('#optionsSteak').addClass('hidden');
		$('#optionsPasta').addClass('hidden');
		$('#optionsEntree').addClass('hidden');
		$(option).removeClass('hidden');
	}
	function contains(topping, array) {
    var i = array.length;
    while (i--) {
       if (array[i] == topping) {
           return false;
       }
    }
    return true;
	}
});