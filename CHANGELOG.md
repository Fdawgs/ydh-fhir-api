# Changelog

## 1.0.0 (2022-05-12)


### Features

* add basic route and queries; add migrations ([#11](https://github.com/Fdawgs/ydh-fhir-api/issues/11)) ([24af6d6](https://github.com/Fdawgs/ydh-fhir-api/commit/24af6d6199ac9b45d905e4fea4251e5b2335f5b2))


### Continuous Integration

* add dependency-review job ([6f2f2c7](https://github.com/Fdawgs/ydh-fhir-api/commit/6f2f2c712dafddfc375cc975f35b4849ef3d114b))
* **cd:** update org name for release-please-action ([70a8d9e](https://github.com/Fdawgs/ydh-fhir-api/commit/70a8d9eb439cf53d0fef329df663acd701a2363d))
* **ci:** require `unit-tests` job to pass for `save-pr-number` job to run ([9881de0](https://github.com/Fdawgs/ydh-fhir-api/commit/9881de0fd576017f88f0fb6586d62c63a6021a9d))
* **codeql:** only run on pr changes to `.html`, `.js`, and `.yml` files ([2c19d3e](https://github.com/Fdawgs/ydh-fhir-api/commit/2c19d3e843f01159717726ce8c96e669a6249bf4))
* **codeql:** resolve missing analyses ([96fa85a](https://github.com/Fdawgs/ydh-fhir-api/commit/96fa85aaf03e6a78c4d8629620e1e1b9bc653e08))
* **codeql:** specify which files to scan during analysis ([779a4e6](https://github.com/Fdawgs/ydh-fhir-api/commit/779a4e6ebb623ad7cb0c5ce0ed3150ba14d28c3b))
* **link-check:** replace `npx linkinator` call with github action ([de77969](https://github.com/Fdawgs/ydh-fhir-api/commit/de779696314709b946c7221818082293a297150a))
* only trigger dependency-review on pr ([4268fc8](https://github.com/Fdawgs/ydh-fhir-api/commit/4268fc8ca5e615297960c74937f81e63968fc588))
* reduce workflow permissions to minimum ([8617110](https://github.com/Fdawgs/ydh-fhir-api/commit/86171100582656757a7acfb1fd983b4188c958c3))
* replace workflow-run-cleanup-action with github concurrency ([f75df22](https://github.com/Fdawgs/ydh-fhir-api/commit/f75df225d0a9076f1509d60c2711cacf28e911d7))
* use shorter arg aliases for lockfile lint step ([de31121](https://github.com/Fdawgs/ydh-fhir-api/commit/de31121ef5cb034d003370ce7f67e3a8dabbdbb6))
* validate that resolved url matches the package name ([a68bb72](https://github.com/Fdawgs/ydh-fhir-api/commit/a68bb7256ebbbc1b351b493ed5f4410c6cb5a466))


### Documentation

* fix links ([c3edcfe](https://github.com/Fdawgs/ydh-fhir-api/commit/c3edcfecd55855fe9b3cf20230cd0203448ddc22))
* move background section to own file ([a979d17](https://github.com/Fdawgs/ydh-fhir-api/commit/a979d173eb4cb3eebeb3eace9461ebd71318d4c0))
* **readme:** add acknowledgements and license section ([b704865](https://github.com/Fdawgs/ydh-fhir-api/commit/b7048656b119d914f85efcff3059b184ce118c82))
* **readme:** add known-issues section ([0d7d85f](https://github.com/Fdawgs/ydh-fhir-api/commit/0d7d85fbb45eb571952d5830ba12ea638f751af5))
* **readme:** add mention of insomnia example requests ([11d2a2a](https://github.com/Fdawgs/ydh-fhir-api/commit/11d2a2a3645f0ebbb289313d836f52bea039ea3e))
* **readme:** remove `db:migrate` step, now runs on start of api ([886c57a](https://github.com/Fdawgs/ydh-fhir-api/commit/886c57a87e3c78a13b7fb0e966939aee9ebeab0f))
* **readme:** remove snyk badge ([f658717](https://github.com/Fdawgs/ydh-fhir-api/commit/f658717994595a56000eb619f19c5112a56c3624))
* update deployment steps to use `npm ci` ([4e990ff](https://github.com/Fdawgs/ydh-fhir-api/commit/4e990ff0f8ba4134a83729a51d0974b2cb53fb28))


### Dependencies

* **deps-dev:** bump @commitlint/cli from 16.2.3 to 16.2.4 ([#19](https://github.com/Fdawgs/ydh-fhir-api/issues/19)) ([14c1c83](https://github.com/Fdawgs/ydh-fhir-api/commit/14c1c833906b0238a3d445654cdd8172c16f56be))
* **deps-dev:** bump @commitlint/config-conventional ([#26](https://github.com/Fdawgs/ydh-fhir-api/issues/26)) ([b28ec9f](https://github.com/Fdawgs/ydh-fhir-api/commit/b28ec9fa85eddf9f03b61512c9cbd923c4ff9c16))
* **deps-dev:** bump @faker-js/faker from 6.1.2 to 6.2.0 ([#31](https://github.com/Fdawgs/ydh-fhir-api/issues/31)) ([aa951e2](https://github.com/Fdawgs/ydh-fhir-api/commit/aa951e20f6841670afb9c2b33bf718b84fb16c23))
* **deps-dev:** bump @faker-js/faker from 6.2.0 to 6.3.1 ([#42](https://github.com/Fdawgs/ydh-fhir-api/issues/42)) ([4732969](https://github.com/Fdawgs/ydh-fhir-api/commit/473296911e3f085bef3ef9f7e609471878af1d96))
* **deps-dev:** bump autocannon from 7.8.1 to 7.9.0 ([#40](https://github.com/Fdawgs/ydh-fhir-api/issues/40)) ([48d9617](https://github.com/Fdawgs/ydh-fhir-api/commit/48d96178148380ccff33aa76b8cc149788ccdd0d))
* **deps-dev:** bump eslint from 8.13.0 to 8.14.0 ([#29](https://github.com/Fdawgs/ydh-fhir-api/issues/29)) ([c1cfb64](https://github.com/Fdawgs/ydh-fhir-api/commit/c1cfb649b31de7646c9de9ad01d824b362756858))
* **deps-dev:** bump eslint from 8.14.0 to 8.15.0 ([#45](https://github.com/Fdawgs/ydh-fhir-api/issues/45)) ([6c50ed7](https://github.com/Fdawgs/ydh-fhir-api/commit/6c50ed7b980b3a36d799c672d75babd594d3943c))
* **deps-dev:** bump eslint-plugin-jest from 26.1.4 to 26.1.5 ([#35](https://github.com/Fdawgs/ydh-fhir-api/issues/35)) ([e3277cb](https://github.com/Fdawgs/ydh-fhir-api/commit/e3277cbca19363080f114df4cad2cc73e279ae2d))
* **deps-dev:** bump eslint-plugin-jsdoc from 38.1.6 to 39.2.9 ([#22](https://github.com/Fdawgs/ydh-fhir-api/issues/22)) ([9b39537](https://github.com/Fdawgs/ydh-fhir-api/commit/9b39537db376e55233860f3e7589e0b0f11e6382))
* **deps-dev:** bump eslint-plugin-security from 1.4.0 to 1.5.0 ([#34](https://github.com/Fdawgs/ydh-fhir-api/issues/34)) ([2e900ea](https://github.com/Fdawgs/ydh-fhir-api/commit/2e900eac7571e8f9a419002e84552c56a83a4358))
* **deps-dev:** bump glob from 7.2.0 to 8.0.1 ([#23](https://github.com/Fdawgs/ydh-fhir-api/issues/23)) ([d8fd670](https://github.com/Fdawgs/ydh-fhir-api/commit/d8fd6709932b3f7ef7a71cb6e947e90fbdd89230))
* **deps-dev:** bump husky from 7.0.4 to 8.0.1 ([#47](https://github.com/Fdawgs/ydh-fhir-api/issues/47)) ([09ad888](https://github.com/Fdawgs/ydh-fhir-api/commit/09ad888c17944549570046f702f0f908df64a74d))
* **deps-dev:** bump jest from 27.5.1 to 28.0.3 ([#25](https://github.com/Fdawgs/ydh-fhir-api/issues/25)) ([6d84af1](https://github.com/Fdawgs/ydh-fhir-api/commit/6d84af1d6a315515cefaf60ef477de2cee2746e9))
* **deps-dev:** bump jest from 28.0.3 to 28.1.0 ([#46](https://github.com/Fdawgs/ydh-fhir-api/issues/46)) ([7ed9a85](https://github.com/Fdawgs/ydh-fhir-api/commit/7ed9a8595ed71104c1138102dc195d346d22137c))
* **deps-dev:** bump nodemon from 2.0.15 to 2.0.16 ([#33](https://github.com/Fdawgs/ydh-fhir-api/issues/33)) ([bd94de4](https://github.com/Fdawgs/ydh-fhir-api/commit/bd94de4bf62058531076a38e1ef1f91871172d34))
* **deps-dev:** bump playwright from 1.20.2 to 1.21.1 ([#21](https://github.com/Fdawgs/ydh-fhir-api/issues/21)) ([2e91ef3](https://github.com/Fdawgs/ydh-fhir-api/commit/2e91ef307c1cafdc6889dfcfe904c45dd1e321d1))
* **deps-dev:** bump prettier from 2.6.1 to 2.6.2 ([#2](https://github.com/Fdawgs/ydh-fhir-api/issues/2)) ([ef667dc](https://github.com/Fdawgs/ydh-fhir-api/commit/ef667dc5b330240a01c594e8eaeadd9edd3ba454))
* **deps:** bump @fastify/autoload from 4.0.0 to 4.0.1 ([#24](https://github.com/Fdawgs/ydh-fhir-api/issues/24)) ([a5e25ad](https://github.com/Fdawgs/ydh-fhir-api/commit/a5e25add6a3f5df8e91ecb77ee350f524368e3d9))
* **deps:** bump @fastify/basic-auth from 3.0.0 to 3.0.2 ([#38](https://github.com/Fdawgs/ydh-fhir-api/issues/38)) ([aa25489](https://github.com/Fdawgs/ydh-fhir-api/commit/aa25489481b2e9f361d2cb972ad4ac87c5704905))
* **deps:** bump @fastify/bearer-auth from 7.0.0 to 7.0.1 ([#41](https://github.com/Fdawgs/ydh-fhir-api/issues/41)) ([b2efe89](https://github.com/Fdawgs/ydh-fhir-api/commit/b2efe897f7ab7f4f826f98ba973d1ba29df8245f))
* **deps:** bump @fastify/sensible from 4.0.0 to 4.1.0 ([#49](https://github.com/Fdawgs/ydh-fhir-api/issues/49)) ([600bd6c](https://github.com/Fdawgs/ydh-fhir-api/commit/600bd6c1ab91aae9c9bd345afdaa21e79b502b72))
* **deps:** bump @fastify/static from 5.0.0 to 5.0.2 ([#39](https://github.com/Fdawgs/ydh-fhir-api/issues/39)) ([e1c1100](https://github.com/Fdawgs/ydh-fhir-api/commit/e1c11003de73ff294ce8a9d8bb270e5572df57cd))
* **deps:** bump @tediousjs/connection-string from 0.3.0 to 0.4.0 ([#20](https://github.com/Fdawgs/ydh-fhir-api/issues/20)) ([cc65c15](https://github.com/Fdawgs/ydh-fhir-api/commit/cc65c15d1479e00716cb0f4b0390f8ce8f91cd7d))
* **deps:** bump actions/upload-artifact from 2 to 3 ([#18](https://github.com/Fdawgs/ydh-fhir-api/issues/18)) ([cb66972](https://github.com/Fdawgs/ydh-fhir-api/commit/cb66972457fda5e7e0ff204e4a90ac0e4b50b8ff))
* **deps:** bump fast-jwt from 1.5.3 to 1.5.4 ([#28](https://github.com/Fdawgs/ydh-fhir-api/issues/28)) ([32d6726](https://github.com/Fdawgs/ydh-fhir-api/commit/32d67268a7df24598e7658bfd285e071f5bc4611))
* **deps:** bump fastify from 3.28.0 to 3.29.0 ([#30](https://github.com/Fdawgs/ydh-fhir-api/issues/30)) ([79a76cc](https://github.com/Fdawgs/ydh-fhir-api/commit/79a76cc5a4edde3c1bafd5f9433cd98695614287))
* **deps:** bump github/codeql-action from 1 to 2 ([#17](https://github.com/Fdawgs/ydh-fhir-api/issues/17)) ([4b280d9](https://github.com/Fdawgs/ydh-fhir-api/commit/4b280d9a42a9dca984ec2e9ca7bb06766e0b0003))
* **deps:** bump jwks-rsa from 2.0.5 to 2.1.0 ([#27](https://github.com/Fdawgs/ydh-fhir-api/issues/27)) ([960ec92](https://github.com/Fdawgs/ydh-fhir-api/commit/960ec9209cdfa808e7f4b9e34069d6f805a036c8))
* **deps:** bump jwks-rsa from 2.1.0 to 2.1.1 ([#48](https://github.com/Fdawgs/ydh-fhir-api/issues/48)) ([7ad4e6a](https://github.com/Fdawgs/ydh-fhir-api/commit/7ad4e6ac5d0ac5107ca98319bf915be0af5f3080))
* **deps:** bump pino from 7.10.0 to 7.11.0 ([#32](https://github.com/Fdawgs/ydh-fhir-api/issues/32)) ([dcf0ef4](https://github.com/Fdawgs/ydh-fhir-api/commit/dcf0ef4a67953489b58955c8382fbe600aed93ef))
* **deps:** bump redoc from 2.0.0-rc.66 to 2.0.0-rc.67 ([#36](https://github.com/Fdawgs/ydh-fhir-api/issues/36)) ([28bf4e0](https://github.com/Fdawgs/ydh-fhir-api/commit/28bf4e04a09bc532375bbfcd0b7cf822d1ce8cd0))
* **deps:** bump under-pressure from 5.8.0 to 5.8.1 ([#44](https://github.com/Fdawgs/ydh-fhir-api/issues/44)) ([eb62609](https://github.com/Fdawgs/ydh-fhir-api/commit/eb62609e861ac9ef58c2c39ca2c1714325b28f4f))
* use new `[@fastify](https://github.com/fastify)` org dependencies ([#15](https://github.com/Fdawgs/ydh-fhir-api/issues/15)) ([e4c8e14](https://github.com/Fdawgs/ydh-fhir-api/commit/e4c8e14644cd44c831a6e7ffc3c1a349852f0e85))


### Miscellaneous

* **.eslintrc:** enable `plugin:jest/style` rules ([0a3cdda](https://github.com/Fdawgs/ydh-fhir-api/commit/0a3cddaf89898901cba9809065325b2622977964))
* **.github/codeql-config:** remove quotation marks ([0c03109](https://github.com/Fdawgs/ydh-fhir-api/commit/0c03109fa61f10784245e21cbecb743d349b95ab))
* **.github/workflows/link-check:** use `skip` input ([31f6f75](https://github.com/Fdawgs/ydh-fhir-api/commit/31f6f75549c2a4f582310ed2449a5eafe65cc9a1))
* add scaffolding for app ([#7](https://github.com/Fdawgs/ydh-fhir-api/issues/7)) ([cb1a9f7](https://github.com/Fdawgs/ydh-fhir-api/commit/cb1a9f7d10ee26a6f927c51ba923f74bf6c5fd67))
* add supporting files ([7e6c808](https://github.com/Fdawgs/ydh-fhir-api/commit/7e6c808314a79c9abd99d77d0f6382b8b719d375))
* **ci:** remove quotation marks from step name ([21bb03d](https://github.com/Fdawgs/ydh-fhir-api/commit/21bb03d45b2d9f6fb214fb2d0d3619885da7840a))
* **server:** add missing asterisk to inline comment block ([85f93e2](https://github.com/Fdawgs/ydh-fhir-api/commit/85f93e2483eb1f8d0ced884842024b2081ef811c))
* tidy ([1f7d0d8](https://github.com/Fdawgs/ydh-fhir-api/commit/1f7d0d8dd466f50308f2b5736191277f9e5cad7a))
* use npm install alias ([7047f7d](https://github.com/Fdawgs/ydh-fhir-api/commit/7047f7da613a7ac6b867e3b8101b489714d1bf06))
