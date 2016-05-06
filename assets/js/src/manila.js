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
            .replace(/\<--(?!\s*}.*?-->)(?!.*{\s*-->)(.*?)-->/g, "`,$1,`")
            .replace(/\<--\s*(.*?)\s*-->/g, "`);$1\np.push(`")
            .replace(/\<-(?!\s*}.*?->)(?!.*{\s*->)(.*?)->/g, "`,manila.e($1),`")
            .replace(/\<-\s*(.*?)\s*->/g, "`);$1\np.push(`")

      + "`);}return p.join('');");
}

function esc(str) {

    return str.replace(/[&<>'"]/g, c => {

        return escapeMap[c];

    });

}

function e(val) {

    return typeof val === 'string' ? esc(val) : val;

}

manila.e = e;

window.manila = manila;

export { manila };