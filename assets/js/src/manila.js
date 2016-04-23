const escapeMap = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;'
};

function manila(template) {

    return new Function('context',

        "var p=[];with(context){p.push(`" +
       
        template
        	.replace(/\\'/g, "\\\\'")
            .replace(/`/g, "\\`")
            .replace(/\<<<(?!\s*}.*?>>>)(?!.*{\s*>>>)(.*?)>>>/g, "`,(typeof $1==='undefined'?'':$1),`")
            .replace(/\<<<\s*(.*?)\s*>>>/g, "`);$1\np.push(`")
            .replace(/\<<(?!\s*}.*?>>)(?!.*{\s*>>)(.*?)>>/g, "`,(typeof $1==='undefined'?'':manila.e($1)),`")
            .replace(/\<<\s*(.*?)\s*>>/g, "`);$1\np.push(`")

      + "`);}return p.join('');");
}

function esc(str) {

    return str.replace(/[&<>'"]/g, c => {

        return escapeMap[c];

    });

}

function e(val) {

    return typeof val === 'string' ? manila.esc(val) : val;

}

manila.esc = esc;

manila.e = e;

window.manila = manila;

export { manila };