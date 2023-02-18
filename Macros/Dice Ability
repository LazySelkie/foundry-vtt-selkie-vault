// При использовании способности, основанной на кости, роляет текущее значение и в зависимости от условий понижения/повышения кости изменяет свое значение
// Работает на 9 версии FoundryVTT

// Требуемые модули: Item Macro, MidiQoL
// Это макрос предмета. Он должен быть помещен в Item Macro действия/особенности, а у самой особенности в Подробностях нужно указать вызов ItemMacro при использовании.

// ВАЖНО: У способности должно быть указано, что тратит Заряды предмета -> свои заряды (выбрать в выпадающем меню) -> тратит 0 зарядов
// Макрос сам меняет значение текущего количества зарядов, поэтому нужно чтобы само не списывало
// Также у способности максимальным колвом зарядов надо поставить максимальный размер кости (минимальный задается в макросе)

// Также если вы хотите другое поведение кости, то обратите внимание на функции diceUp и diceDown - в них определены условия, при которых кость повышается/понижается

////////////////////////////////////////////////////////////
const abilityName = "Способность-дайс"; // Вместо Способность-дайс впишите название способности (ТОЧНОЕ название)
const minDice = 0; // Минимальный допустимый размер кости
const downValue = 1; // Максимальное значение, при котором кость становится меньше (например, если понижается на 1,2, то это значение будет 2)
const upValue = 0; // Максимально возможная разница между результатом ролла и текущим максимумом кости, при котором значение кости повышается
// Т.е. если (размерКости - результатРолла) <= этого значения, кость повысится (если это возможно)
// Т.е.при upValue 0 кость повышается при выпадении максимума, при 1 кость д6 повысится при выпадении 5 или 6, и т.д.

let actorData = actor || canvas.tokens.controlled[0] || game.user.character;
let featData = actorData ? actorData.items.find(i => i.name===abilityName) : null;

if (actorData == null || featData == null) {
    ui.notifications.warn(`У персонажа должна быть особенность ${abilityName}.`);
    return;
}

let featUpdate = duplicate(featData);
let dice = featUpdate.data.uses.value;
let diceMax = featUpdate.data.uses.max;

let roll = await new Roll(`1d${dice}`).roll();
let message = "";

// Здесь условие для повышения кости. В данном примере это ролл значения, равного максимуму текущей кости (6 на д6, например)
let function diceUp() {
  return dice - roll.total <= upValue;
}
// Здесь условие для понижения кости. В данном примере это ролл значения, равного или меньше чем downValue
function diceDown() {
  return roll.total <= downValue;
}

if (diceDown()) {
	// понижение кости
	if (dice > minDice) { // Есть ли куда понижать?
		dice = dice == 4? 0: dice - 2;
		message = "Кость понижена";
	}
	featUpdate.data.uses.value = dice;
	await actorData.items.getName(abilityName).update({ "data.uses.value" : featUpdate.data.uses.value });
	// Ререндер листа, если нужно
	if (actorData.sheet.rendered) {
	    await actorData.render(true);
	}
}
else if (diceUp()) {
	// повышение кости
	if (dice < diceMax) { // Есть ли куда повышать?
		dice = dice == 0? 4: dice + 2;
		message = "Кость повышена";
	}
	featUpdate.data.uses.value = dice;
	await actorData.items.getName(abilityName).update({ "data.uses.value" : featUpdate.data.uses.value });
	// Ререндер листа, если нужно
	if (actorData.sheet.rendered) {
	    await actorData.render(true);
	}
}
roll.toMessage({
	                        speaker: ChatMessage.getSpeaker(),
	                        flavor: `<p><em>Результат: ${roll.total}.  ${message}</em></p>` });
