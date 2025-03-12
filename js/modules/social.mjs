class Link {
	#link;

	constructor(link) {
		this.#link = link;
	}

	get link() {
		return this.#link;
	}

	get anchor() {
		const a = document.createElement("a");
		a.href = this.#link;
		a.textContent = this.name;
		a.target = "_blank";
		return a;
	}

	/** Paramètre du lien
	 * @param {string} v
	 */
	set link(v) {
		this.#link = v;
	}

    toJSON() {
        return {
            link: this.#link
        };
    }

    static fromJSON(json) {
        return new Link(json.link);
    }
}

export class GithubLink extends Link {
	static root = "https://github.com/";
	#name;

	/**
	 * @param {string} name
	 * @param {string} link
	 */
	constructor(name, link = null, user = null) {
		super(link || `${GithubLink.root}${name}`);
		this.#name = name;
	}

	get name() {
		return this.#name;
	}

	/** Lien au format HTML */
	get anchor() {
		return super.anchor;
	}

	/** Paramètre du nom
	 * @param {string} v
	 */
	set name(v) {
		this.name = v;
		super.link = `${GithubLink.root}${this.name}`;
	}

    toJSON() {
        return {
            ...super.toJSON(),
            name: this.#name
        };
    }

    static fromJSON(json) {
        return new GithubLink(json.name, json.link, json.user);
    }
}

export class LinkedInLink extends Link {
	static root = "https://www.linkedin.com/in/";
	#name;

	constructor(name, link = null) {
		super(link || `${LinkedInLink.root}${name}`);
		this.#name = name;
	}

	get name() {
		return this.#name;
	}

    toJSON() {
        return {
            ...super.toJSON(),
            name: this.#name
        };
    }

    static fromJSON(json) {
        return new LinkedInLink(json.name, json.link);
    }
}

export class WebSiteLink extends Link {
	#name;

	constructor(name, link) {
		super(link);
		this.#name = name;
	}

	get name() {
		return this.#name;
	}

    toJSON() {
        return {
            ...super.toJSON(),
            name: this.#name
        };
    }

    static fromJSON(json) {
        return new WebSiteLink(json.name, json.link);
    }
}