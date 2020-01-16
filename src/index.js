class I18N {
    constructor(dictionary = {}) {
        if (!!I18N.instance) return I18N.instance;
        I18N.instance = this;

        this._dictionary = {};
        this._HTMLlangDefault;
        this._langActive;
        this._lastTranslation;

        if(Object.keys(dictionary).length != 0) {
            this.addInDictionary(dictionary);  
        };

        this.insertDefaultInDictionary();
        this.setHTMLlangDefault();
        this.setLang((window.localStorage.getItem('i18n_langActive') || ''));
    };

    getDictionary () {
        return this._dictionary;
    };

    addKeysInDictionary(dictionary, dict, key, replace) {
        if(typeof dictionary[dict][key] !== 'object') {
            if(replace) {
                this._dictionary[(dict.toLowerCase())][key] = dictionary[dict][key];
            } else {
                if(!this._dictionary[(dict.toLowerCase())][key]) {
                    this._dictionary[(dict.toLowerCase())][key] = dictionary[dict][key];
                };
            };         
        } else {
            if(dictionary[dict][key]['replace']) {
                this._dictionary[(dict.toLowerCase())][key] = dictionary[dict][key]['value'];
            } else {
                if(!this._dictionary[(dict.toLowerCase())].hasOwnProperty([key])) {
                    this._dictionary[(dict.toLowerCase())][key] = dictionary[dict][key]['value'];
                };
            };
        };
        return;
    };

    addWordsInDictionary(dictionary, dict, keys, replace) {
        if(!this._dictionary[(dict.toLowerCase())]) this._dictionary[(dict.toLowerCase())] = {};
        if(typeof keys === 'object') {
            Array.prototype.forEach.call(keys, key => {
                this.addKeysInDictionary(dictionary, dict, key, replace);
            });
        } else {
            this.addKeysInDictionary(dictionary, dict, keys, replace);                
        };
        return;
    };

    addInDictionary(dictionary, replace = false) {
        if(!dictionary || Object.keys(dictionary).length == 0) return new Error(`dictionary not sent`);

        if(!dictionary['pattern'] || !(dictionary['pattern'] === 1 || dictionary['pattern'] === 2)) {
            return new Error(`invalid dictionary pattern`);
        };

        let pattern = dictionary['pattern'];
        if(pattern == 1) {
            let dicts = Object.keys(dictionary['dicts']);
            Array.prototype.forEach.call(dicts, (dict) => {
                let keys =  Object.keys(dictionary['dicts'][dict]);
                this.addWordsInDictionary(dictionary['dicts'], dict, keys, replace);
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

    insertDefaultInDictionary() {
        if(!this._dictionary['default']) this._dictionary['default'] = {};
        let txt = document.querySelectorAll('[i18n]');
        // let title = document.querySelectorAll('[i18nTitle]');
        // let arr = Object.assign(txt, title);
        this.addDefaultInDictionary(txt);
    };

    addDefaultInDictionary(arr) {
        Array.prototype.forEach.call(arr, w => {
            if(this._dictionary['default'][w.getAttribute("i18n")] === undefined) {
                this._dictionary['default'][w.getAttribute("i18n")] = w.innerHTML;
            };    
        });      
    };

    setHTMLlangDefault() {
        this._HTMLlangDefault = document.querySelector('html').lang;
    };

    getBrowserLang() {
        let lang = navigator.browserLanguage || navigator.language;
        return lang.toLowerCase();
    };   

    getLang() {
        return this._langActive;
    };

    getHTMLlangDefault() {
        return this._HTMLlangDefault;
    };

    translate(w) {
        if(w === undefined || w === '') return;
        let r = this._dictionary[this._langActive] || null;
        if(!r) return;
        if(r[w]) return r[w];
        return this._dictionary['default'][w];  
    };

    replaceHTML(el, html) {
        let newEl = el.cloneNode(false);
        newEl.innerHTML = html;
        el.parentNode.replaceChild(newEl, el);
    };

    i18nTxt() {
        let ws = document.querySelectorAll('[i18n]');
        Array.prototype.forEach.call(ws, (w) => {
            let t = this.translate(w.getAttribute("i18n"));
            if(t !== undefined) {
                this.addDefaultInDictionary(w);
                this.replaceHTML(w, t)
            };
        });
    };         
     
    // i18nTitle() {
    //     let ws = document.querySelectorAll('[i18nTitle]');
    //     Array.prototype.forEach.call(ws, (w) => {
    //         let t  = this.translate(w.getAttribute("i18nTitle"));
    //         if(t !== undefined) (w.setAttribute("title", t));
    //     });
    // };

    i18nChange() {
        let ls = document.querySelectorAll('[i18nChange]');
        Array.prototype.forEach.call(ls, (l) => {
            if(l.nodeName == 'SELECT') {
                l.addEventListener('change', (e) => {
                    let opts = l.querySelectorAll('option');
                    this.setLang(opts[l.selectedIndex].value || 'default');
                });
            } else {
                l.addEventListener('click', e => {
                    e.preventDefault();
                    this.setLang(l.getAttribute('i18nChange') || 'default');
                });
            }
        });
    };

    render() {
        this.i18nTxt(); this.i18nChange();
        // this.i18nTitle(); 
    };   

    setLang(lang = '') {
        
        if(lang == '') lang = (this._langActive == '') ? this.getBrowserLang() : this.getLang(); 
        if(lang) lang = lang.toLowerCase();
        if(!this._dictionary[lang]) lang = 'default'; 

        if(lang == this._lastTranslation) return;

        this._langActive = lang;    
        this._lastTranslation = lang;

        document.querySelector('html').lang = (lang === 'default') ? this.getHTMLlangDefault() : lang;
        window.localStorage.setItem('i18n_langActive', lang);
        this.render();
    };
};

const i18n = new I18N();
export default i18n;