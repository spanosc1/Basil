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
	  crust: "",
	  toppings: [],
	  toppingsLeft: [],
	  toppingsRight: [],
	  cooked: "",
	  comment: ""
	};
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
		$('#optionsSteak').addClass('hidden');
		$('#optionsPizza').removeClass('hidden');
		currentItem = $(this).get(0).attributes[3].value;
		pizza.type = currentItem;
		$(".thisItem").text(currentItem);
		var defaultToppings = menu.pizza[currentItem].toppings;
		$(".form-control").val("normal");
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
								  +  '</tr>'
				if(menu.pizza.allToppingsPrices[menu.pizza.toppings[i]] == 3.00)
				{
					$('#regularToppings').append(toppingHTML);
				}
				else if(menu.pizza.allToppingsPrices[menu.pizza.toppings[i]] == 4.00)
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
		$('#optionsPizza').addClass('hidden');
		$('#optionsSteak').removeClass('hidden');
		currentItem = $(this).get(0).attributes[3].value;
		$(".thisItem").text(currentItem);
	});
	//Unchecks checkboxes in same name group if another is selected (ex. user picks left pepperoni, then changes to all)
	$('#pizzaForm').on('click', 'input:checkbox', function() {
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