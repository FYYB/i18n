'use strict'
class I18N {
    constructor(dictionary = {}) {
        if (!!I18N.instance) return I18N.instance;
        I18N.instance = this;

        let _dictionary = {};
        let _HTMLlangDefault;
        let _langActive;
        let _lastTranslation;

        this.getDictionary = function () {
            return _dictionary;
        };

        function addKeysInDictionary(dictionary, dict, key, replace) {
            if(typeof dictionary[dict][key] !== 'object') {
                if(replace) {
                    _dictionary[(dict.toLowerCase())][key] = dictionary[dict][key];
                } else {
                    if(!_dictionary[(dict.toLowerCase())][key]) {
                        _dictionary[(dict.toLowerCase())][key] = dictionary[dict][key];
                    };
                };
                 
            } else {
                if(dictionary[dict][key]['replace']) {
                    _dictionary[(dict.toLowerCase())][key] = dictionary[dict][key]['value'];
                } else {
                    if(!_dictionary[(dict.toLowerCase())].hasOwnProperty([key])) {
                        _dictionary[(dict.toLowerCase())][key] = dictionary[dict][key]['value'];
                    };
                };
            };
            return;
        };

        function addWordsInDictionary(dictionary, dict, keys, replace) {
            if(!_dictionary[(dict.toLowerCase())]) _dictionary[(dict.toLowerCase())] = {};
            if(typeof keys === 'object') {
                Array.prototype.forEach.call(keys, key => {
                    addKeysInDictionary(dictionary, dict, key, replace);
                });
            } else {
                addKeysInDictionary(dictionary, dict, keys, replace);                
            };
            return;
        };

        this.addInDictionary = function(dictionary, replace = false) {
            if(!dictionary || Object.keys(dictionary).length == 0) return new Error(`dictionary not sent`);

            if(!dictionary['pattern'] || !(dictionary['pattern'] === 1 || dictionary['pattern'] === 2)) {
                return new Error(`invalid dictionary pattern`);
            };

            let pattern = dictionary['pattern'];
            if(pattern == 1) {
                let dicts = Object.keys(dictionary['dicts']);
                Array.prototype.forEach.call(dicts, (dict) => {
                    let keys =  Object.keys(dictionary['dicts'][dict]);
                    addWordsInDictionary(dictionary['dicts'], dict, keys, replace);
                });

            } else if(pattern == 2) {
                let keys = Object.keys(dictionary['dicts']);
                let nDict = {};
                Array.prototype.forEach.call(keys, key => {
                    let dicts =  Object.keys(dictionary['dicts'][key]);
                    Array.prototype.forEach.call(dicts, d => {
                        if(!nDict[(d.toLowerCase())]) nDict[(d.toLowerCase())] = {};
                        if(!nDict[(d.toLowerCase())][key]) nDict[(d.toLowerCase())][key] = dictionary['dicts'][key][d];  
                    });
                })
                
                this.addInDictionary({'pattern': 1, 'dicts': nDict}, replace);
            }

            return this;
        };

        function addDefaultInDictionary(arr) {
            Array.prototype.forEach.call(arr, w => {
                if(_dictionary['default'][w.getAttribute("i18n")] === undefined) {
                    _dictionary['default'][w.getAttribute("i18n")] = w.innerHTML;
                };    
            });      
        };

        function insertDefaultInDictionary() {
            if(!_dictionary['default']) _dictionary['default'] = {};
            let txt = document.querySelectorAll('[i18n]');
            let title = document.querySelectorAll('[i18nTitle]');
            let arr = Object.assign(txt, title);
            addDefaultInDictionary(arr);
        };
        
        function setHTMLlangDefault() {
            _HTMLlangDefault = document.querySelector('html').lang;
        };

        this.getHTMLlangDefault = function () {
            return _HTMLlangDefault;
        };

        this.setLang = function (lang = '') {
            if(lang == '') lang = (_langActive == '') ? getBrowserLang() : this.getLang(); 
            
            lang = lang.toLowerCase();
            if(!_dictionary[lang]) lang = 'default'; 

            if(lang == _lastTranslation) return;
    
            _langActive = lang;    
            _lastTranslation = lang;

            document.querySelector('html').lang = (lang === 'default') ? this.getHTMLlangDefault() : lang;
            window.localStorage.setItem('i18n_langActive', lang);
            this.render();
        };     

        this.getLang = function () {
            return _langActive;
        };
    
        function getBrowserLang() {
            let lang = navigator.browserLanguage || navigator.language;
            return lang.toLowerCase();
        };         
         
        function translate(w) {
            if(w === undefined || w === '') return;
            let r = _dictionary[_langActive] || null;
            if(!r) return;
            return r[w];  
        };         
         
        function i18nTxt () {
            let ws = document.querySelectorAll('[i18n]');
            Array.prototype.forEach.call(ws, (w) => {
                let t = translate(w.getAttribute("i18n"));
                if(t !== undefined) {
                    addDefaultInDictionary(w);
                    replaceHTML(w, t)
                };
            });
        };         
         
        function i18nTitle () {
            let ws = document.querySelectorAll('[i18nTitle]');
            Array.prototype.forEach.call(ws, (w) => {
                let t  = (this.translate(w.getAttribute("i18nTitle")));
                if(t !== undefined) (w.setAttribute("title", t));
            });
        };
    
        function replaceHTML(el, html) {
            let newEl = el.cloneNode(false);
            newEl.innerHTML = html;
            el.parentNode.replaceChild(newEl, el);
        };
    
        this.render = function () {
            i18nTxt(); i18nTitle();
        };         
         
        if(Object.keys(dictionary).length != 0) {
            this.addInDictionary(dictionary);  
        };        
         
        insertDefaultInDictionary();
        setHTMLlangDefault();
        this.setLang(window.localStorage.getItem('i18n_langActive'));
    };

}