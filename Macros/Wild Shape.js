/* 
Что делает макрос:
✔Меняет текущую картинку и имя токена (а также прототип токена)
✔Сила, Ловкость и Выносливость получаются от животного
✔Получает владение навыками животного
✔Получает владение спасбросками животного
Как работать с "Если у существа есть то же умение, что и у вас, а бонус в его блоке параметров выше вашего, используйте бонус существа вместо своего" ????
✔Получает хп животного (статичные), кости хитов не планирую менять
✔Получает атаки/способности/особенности животного (крч фаундри айтемы)

Что НЕ делает макрос:
- Не реализует кусок описания дикой формы "Если у существа есть то же умение, что и у вас, а бонус в его блоке параметров выше вашего, используйте бонус существа вместо своего" (т.к.я не совсем понимаю на каких случаях такое происходит, на каких тестировать)
- Не заменяет режимы зрения и т.п. т.к."Нельзя использовать особое восприятие вашей обычной формы (вроде ночного зрения), если его нет у новой формы", а разбираться что от спелла, а что от расы, не представляется возможным без кучи проверок на наличие кучи способностей
- Не трогает вещи исходного персонажа в инвентаре, так что может понадобиться вручную снять что-то, дающее бонусы
- Не трогает спеллы персонажа, т.к.предполагается что игрок сам способен запомнить что (обычно) не может кастовать в дикой форме

*/

const formsKey = "Формы друида"; // Название папки либо ключ компендиума, откуда брать список доступных форм
let forms = [];
const whereToLook = "folder"; // Здесь выбор откуда брать формы - компендиум ("packs") или папка в Акторах ("folder")
switch (whereToLook) {
	case "packs": {
		let pack = await game.packs.get(formsKey).getIndex();
		forms = Object.values(pack.contents);
		break;
	}
	case "folder": {
		forms = game.actors.folders.getName(formsKey).contents;
		break;
	}
}

// Функция-мутация токена
async function transformIntoForm(form) {
	if (whereToLook == "packs") {
		form = await fromUuid(form.uuid);
	}
	
	let skills = {};
    for (let i of Object.keys(form.system.skills)) {
        if (token.actor.system.skills[i].proficient < form.system.skills[i].proficient) {
			    skills[`system.skills.${i}.value`] = form.system.skills[i].proficient;
	      }
    }
    let saves = {};
    for (let i of Object.keys(form.system.abilities)) {
        if (token.actor.system.abilities[i].proficient < form.system.abilities[i].proficient) {
  			  saves[`system.abilities.${i}.proficient`] = form.system.abilities[i].proficient;
  	    }
    }

  	const items = {};
  	form.items.forEach( data => {
  		items[data.name] = data.toObject();
  	});

	const updates = {
		token: {
	        'texture.src': form.prototypeToken.texture.src,
	        'width': form.prototypeToken.width,
	        'height': form.prototypeToken.height,
	        'name': `${token.name} (${form.name})`,
			    'lockRotation': form.prototypeToken.lockRotation,
	  },
	  actor: {
		    'system.attributes.hp.value': form.system.attributes.hp.value,
			  'system.attributes.hp.max': form.system.attributes.hp.max,
	      'system.traits.size': form.system.traits.size,
	      'system.attributes.ac': {
	           calc: form.system.attributes.ac.calc,
	           flat: form.system.attributes.ac.value,
    	  },
    		'system.abilities.str': form.system.abilities.str,
    		'system.abilities.dex': form.system.abilities.dex,
    		'system.abilities.con': form.system.abilities.con,
    		...skills,
    		...saves,

			  prototypeToken: {
		        'texture.src': form.prototypeToken.texture.src,
		        'width': form.prototypeToken.width,
		        'height': form.prototypeToken.height,
		        'name': `${token.name} (${form.name})`,
				    'lockRotation': form.prototypeToken.lockRotation,
		    },
	    },
	    embedded: {Item: items},
	}
	
	await warpgate.mutate(token.document, updates, {}, {name: 'Дикий облик'})
}

// Диалоговое окно выбора формы
let formsContent = forms.reduce(function (acc, cur, index) {
	acc += `<option value="${index}">${cur.name}</option>`
	return acc;
}, "");
let content = `
<label for="druidForm-select">Выберите, в какую форму превращаетесь:</label>
<form>
  <select name="druidForm" id="druidForm-select">
    ${formsContent}
  </select>
</form>
`
// Выдать окошко
let druidFormDialog = new Dialog({
	title: `В кого превращаетесь?`,
	content: content,
	buttons: {
		attack: {label: "Превратиться", callback: async (html) => {
			// Получили номер выбранной формы
			let chosenIndex = Number(html.find('#druidForm-select')[0].value);
			
			// Анимация + мутация
			new Sequence()
				.animation()
					.delay(800)
					.on(token)
					.fadeOut(400)
				.effect() 
					.file("jb2a.particle_burst.01.circle.green") 
					.atLocation(token) 
					.scaleToObject(3)
					.randomRotation()
					.tint("#d1e59a")
					.waitUntilFinished()
				.thenDo(async () => {
					await warpgate.revert(token.document, 'Дикий облик');
					await transformIntoForm(forms[chosenIndex]);
				})
					.waitUntilFinished()
				.effect() 
					.file("jb2a.swirling_leaves.outburst.01.greenorange") 
					.atLocation(token) 
					.scaleToObject(2.5) 
					.randomRotation() 
				.animation()
					.delay(400)
					.on(token)
					.fadeIn(400)
				.play()
        }},
        revert: {label: "Отменить превращение", callback: () => {
			new Sequence()
				.animation()
					.delay(800)
					.on(token)
					.fadeOut(400)
				.effect() 
					.file("jb2a.particle_burst.01.circle.green") 
					.atLocation(token) 
					.scaleToObject(3)
					.randomRotation() 
					.tint("#d1e59a")
					.waitUntilFinished()
				.thenDo(async () => {
					await warpgate.revert(token.document, 'Дикий облик');
				})
					.waitUntilFinished()
				.effect() 
					.file("jb2a.swirling_leaves.outburst.01.greenorange") 
					.atLocation(token) 
					.scaleToObject(2.5) 
					.randomRotation() 
				.animation()
					.delay(400)
					.on(token)
					.fadeIn(400)
				.play()
        }},
		back: {label: "Отмена", callback: () => {
        }}
	},
}).render(true);
