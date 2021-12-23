$(".js-range-slider").ionRangeSlider({
    grid: true,
    min: 0,
    max: 30,
    from: 20,
    step: 1,
    //postfix: ' год',
    //max_postfix: ' лет',
    grid_num: 6,
    //drag_interval: true,
    //values: [
    //    "1", "5", "10", "15", "20", "25", "30"
    //]
});

function formatWithSpaces(value) {
    return value.toString().replace(/ /g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function formatInputWithSpaces(input) {
    input.value = formatWithSpaces(input.value);
}

function mortgageSumChanged() {
    var sum = $("#mortgage-sum").val().replace(/ /g, "");
    if (sum < 0) {
        $("#mortgage-sum").val('0');
        return;
    }
    var dpPercent = Math.max(0, Math.min(99, $("#mortgage-downpayment-percent").val()));
    $("#mortgage-downpayment-value").val(formatWithSpaces(Math.round(sum * dpPercent / 100) || 0));
    calculateMortgage();
}

function mortgageDownpaymentValueChanged() {
    var sum = parseInt($("#mortgage-sum").val().replace(/ /g, "")) || 0;
    var dpValue = parseInt($("#mortgage-downpayment-value").val().replace(/ /g, "")) || 0;
    if (dpValue > sum) {
        $("#mortgage-downpayment-value").val(sum);
        dpValue = sum;
    }
    var dpPercent = Math.round(dpValue / sum * 100 * 10) / 10;
    $("#mortgage-downpayment-percent").val(formatWithSpaces(dpPercent || 0));
    calculateMortgage();
}

function mortgageDownpaymentPercentChanged() {
    var sum = parseInt($("#mortgage-sum").val().replace(/ /g, ""));
    var dpPercent = parseInt($("#mortgage-downpayment-percent").val().replace(/ /g, ""));
    if (isNaN(dpPercent) || dpPercent < 0) {
        $("#mortgage-downpayment-percent").val("1");
        dpPercent = 1;
    } else if (dpPercent > 100) {
        $("#mortgage-downpayment-percent").val("100");
        dpPercent = 100;
    }
    var dpValue = Math.round(sum * dpPercent / 100);
    $("#mortgage-downpayment-value").val(formatWithSpaces(dpValue || 0));
    calculateMortgage();
}

function mortgageInterestChanged() {
    var percent = parseInt($("#mortgage-interest").val().replace(/ /g, ""));
    if (isNaN(percent) || percent < 0) {
        $("#mortgage-interest").val("1");
    } else if (percent > 100) {
        $("#mortgage-interest").val("100");
    }
    calculateMortgage();
}

function mortgageTermChanged() {
    calculateMortgage();
}

function mortgageTypeChanged() {
    calculateMortgage();
}

function calculateMortgage() {
    var sum = parseInt($("#mortgage-sum").val().replace(/ /g, ""));
    var dpValue = parseInt($("#mortgage-downpayment-value").val().replace(/ /g, ""));
    var interestPerYear = parseFloat($("#mortgage-interest").val()) / 100;
    var termInMonths = parseInt($("#mortgage-term").val() * 12);
    var type = 'a'; 

    var interestPerMonth = interestPerYear / 12;

    var value = 0;

    if (type === 'a') {
        value = Math.max(0, Math.round((sum - dpValue) * (interestPerMonth / (1 - Math.pow(1 + interestPerMonth, - termInMonths)))));
        $("#mortgage-result-circle").removeClass("diff").addClass("ann");
    } else if (type === "d") {
        var constPart = Math.round(sum / termInMonths);
        var varPart = Math.round(constPart + sum * interestPerMonth);
        value = "от " + constPart + " ₽<br />до " + varPart;
        $("#mortgage-result-circle").removeClass("ann").addClass("diff");
    }

    if (!value) {
        $("#mortgage-result-value").val("-");
    } else {
        $("#mortgage-result-value").html(value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "&thinsp;"));
    }
}