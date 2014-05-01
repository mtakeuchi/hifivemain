/*
 * Copyright (C) 2012-2014 NS Solutions Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * hifive
 */

$(function() {

	// =========================================================================
	//
	// Constants
	//
	// =========================================================================

	// =========================================================================
	//
	// Privates
	//
	// =========================================================================

	//=============================
	// Variables
	//=============================
	//=============================
	// Functions
	//=============================

	// =========================================================================
	//
	// Test Module
	//
	// =========================================================================

	//=============================
	// Definition
	//=============================

	module("createMixin");

	//=============================
	// Body
	//=============================
	test('createMixinでMixinクラスを作成', 2, function() {
		var moduleObject = {
			s1: 'hoge'
		};
		var mixin = h5.mixin.createMixin(moduleObject);
		strictEqual(typeof mixin.mix, 'function', 'mixメソッドを持っていること');
		strictEqual(typeof mixin.hasInstance, 'function', 'hasInstanceメソッドを持っていること');
	});

	test('createMixinで作成したMixinクラスのmix()メソッド', 2, function() {
		function f1() {
		// 何もしない関数1
		}
		var moduleObject = {
			s: 'a',
			f: f1,
			n: 1,
			b: false,
			nul: null,
			undef: undefined,
			o: {},
			S: new String('a'),
			N: new Number(1),
			B: new Boolean(true),
			r: /a/
		};
		var mixin = h5.mixin.createMixin(moduleObject);
		var target = {
			s: '上書きされる値',
			s2: 's2',
			o: {
				hoge: 'hoge'
			}
		};
		var expect = {
			s: 'a',
			f: f1,
			n: 1,
			b: false,
			nul: null,
			s2: 's2',
			o: {
				hoge: 'hoge'
			}
		};
		mixin.mix(target);
		deepEqual(expect, target,
				'mixメソッドでmixinされ、文字列リテラル、関数、数値リテラル、真偽値リテラル、nullのプロパティが上書きでコピーされること');

		function A() {
			this.s1 = 'a';
			this.s4 = 'd';
		}
		A.prototype = {
			s1: 'aa',
			s2: 'bb',
			s5: 'ee'
		};
		mixin = h5.mixin.createMixin(new A());
		target = {
			s2: 'B',
			s3: 'C'
		};
		expect = {
			s1: 'a',
			s2: 'B',
			s3: 'C',
			s4: 'd'
		};
		mixin.mix(target);
		deepEqual(target, expect, 'hasOwnPropertyがtrueのもののみコピーされること');
	});

	test('createMixin作成したMixinクラスのhasInstanceメソッド', 4, function() {
		var module = {
			a: 1,
			n: null
		};
		mixin = h5.mixin.createMixin(module);
		strictEqual(mixin.hasInstance({
			a: 1,
			b: 1,
			n: null
		}), true, 'モジュールオブジェクトのプロパティを持っていればhasInstanceはtrueを返すこと');
		strictEqual(mixin.hasInstance({
			a: null,
			n: false
		}), true, '値が違っていてもプロパティを持っていればhasInstanceはtrueを返すこと');

		function A() {}
		;
		A.prototype = {
			a: 0,
			n: 0
		};
		strictEqual(mixin.hasInstance(new A()), true, 'prototypeで持っていてもhasInstanceはtrueを返すこと');

		strictEqual(mixin.hasInstance({
			a: 1
		}), false, 'モジュールのプロパティを１つでも持っていないオブジェクトを渡した場合はfalseを返すこと');
	});
});
