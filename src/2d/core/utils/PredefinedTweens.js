import gsap from "gsap";

export default class PredefinedTweens {
	constructor() {
		const effectProps = [
			{
				name: "fadeOut",
				getStart: (t) => {
					t.alpha = 1;
				},
				getEnd: (t) => {
					return {
						alpha: () => 0,
					};
				},
				ease: "sine.inOut",
			},
			{
				name: "fadeIn",
				getStart: (t) => {
					t.alpha = 0;
				},
				getEnd: (t) => {
					return {
						alpha: () => 1,
					};
				},
				ease: "sine.inOut",
			},
			{
				name: "fromLeft",
				getStart: (t) => {
					t.x = -t.width * 0.5;
					t.alpha = 1;
				},
				getEnd: (t) => {
					return {
						x: () => t.base.x,
					};
				},
				ease: "back.out(1.3)",
			},
			{
				name: "toLeft",
				getStart: () => {},
				getEnd: (t) => {
					return {
						x: () => -t.width * 0.5,
					};
				},
				ease: "back.in(1.3)",
			},
			{
				name: "fromRight",
				getStart: (t) => {
					t.x = t.parent.lastWidth ? t.parent.lastWidth : t.parent.width + t.width * 0.5;
					t.alpha = 1;
				},
				getEnd: (t) => {
					return {
						x: () => t.base.x,
					};
				},
				ease: "back.out(1.3)",
			},
			{
				name: "toRight",
				getStart: () => {},
				getEnd: (t) => {
					return {
						x: () => (t.parent.lastWidth ? t.parent.lastWidth : t.parent.width + t.width * 0.5),
					};
				},
				ease: "back.in(1.3)",
			},
			{
				name: "fromTop",
				getStart: (t) => {
					t.y = -t.height * 0.5;
					t.alpha = 1;
				},
				getEnd: (t) => {
					return {
						y: () => t.base.y,
					};
				},
				ease: "back.out(1.3)",
			},
			{
				name: "toTop",
				getStart: () => {},
				getEnd: (t) => {
					return {
						y: () => -t.height * 0.5,
					};
				},
				ease: "back.in(1.3)",
			},
			{
				name: "fromBottom",
				getStart: (t) => {
					t.y = t.parent.lastHeight ? t.parent.lastHeight : t.parent.height + t.height * 0.5;
					t.alpha = 1;
				},
				getEnd: (t) => {
					return {
						y: () => t.base.y,
					};
				},
				ease: "back.out(1.3)",
			},
			{
				name: "toBottom",
				getStart: () => {},
				getEnd: (t) => {
					return {
						y: () => (t.parent.lastHeight ? t.parent.lastHeight : t.parent.height + t.height * 0.5),
					};
				},
				ease: "back.in(1.3)",
			},
			{
				name: "scaleUp",
				getStart: (t) => {
					t.scale.set(0);
					t.alpha = 1;
				},
				getEnd: (t) => {
					return {
						scale: () => t.base.scale.x,
					};
				},
				ease: "back.out(1.3)",
			},
			{
				name: "scaleDown",
				getStart: (t) => {
					t.scale.set(t.base.scale.x);
				},
				getEnd: (t) => {
					return {
						scale: () => 0,
					};
				},
				ease: "back.in(1.3)",
			},
			{
				name: "pulse",
				getStart: (t) => {
					t.scale.set(t.base.scale.x);
				},
				getEnd: (t) => {
					return {
						scale: () => t.base.scale.x * 0.95,
					};
				},
				ease: "sine.inOut",
			},
		];

		effectProps.forEach((effectProp) => {
			gsap.registerEffect({
				name: effectProp.name,
				effect: (targets, config) => {
					targets.forEach((target) => {
						const { x, y, scale, alpha, angle } = effectProp.getEnd(target);

						let pixiTweenObj = {};

						if (x) pixiTweenObj.x = x;
						if (y) pixiTweenObj.y = y;
						if (scale) pixiTweenObj.scale = scale;
						if (alpha) pixiTweenObj.alpha = alpha;
						if (angle) pixiTweenObj.angle = angle;

						if (target.onResizeCallback) {
							let tween;

							const animation = {
								getStart: effectProp.getStart.bind(this, target),
								getEnd: effectProp.getEnd.bind(this, target),
								start: () => {
									effectProp.getStart(target);

									tween = gsap.to(target, {
										pixi: pixiTweenObj,
										duration: config.duration,
										ease: config.ease,
										onComplete: () => {
											tween.isCompleted = true;
											config.callback && config.callback();
										},
									});

									animation.tween = tween;
									target.dynamicTweens.push(animation);
								},
							};
							gsap.delayedCall(config.delay, () => {
								animation.start();
							});
							return tween;
						} else {
							effectProp.getStart(target);
							return gsap.to(target, { pixi: pixiTweenObj, duration: config.duration, ease: config.ease, delay: config.delay, onComplete: config.callback });
						}
					});
				},
				defaults: { duration: 0.5, ease: effectProp.ease, delay: 0 },
			});
		});
	}
}
