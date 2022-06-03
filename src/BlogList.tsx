import { useState, useEffect } from 'react'

interface Post {
	title: {
		//This property is always present
		rendered: string;
		//This property is only present in some contexts
		raw?: string;
	},
    content:{
        rendered: string;
    }
    excerpt:{
        rendered: string;
    }
	id: number;
}

function BlogList(){

    const [count, setCount] = useState(0);
    const [blog, setBlogContent] = useState<Array<Post>>([]);
    const [isLoaded, setLoaded] = useState(false);

    useEffect(()=>{
        if(!isLoaded){
            fetch("https://blog.perdhevi.com/wp-json/wp/v2/posts?per_page=3")
            .then(res => res.json())
            .then((result) => {
                setLoaded(true);
                setBlogContent(result);
            })
        }
    });

    if(isLoaded) {
    return (
        <div className="BlogList">
            My recently published Blogs
            <hr />
            {blog.map((item:Post) => (
                <div className="blogContainer" key={"blog_"+item.id}> 
                    <div className="blogHeader" id={"header_"+item.id} dangerouslySetInnerHTML={{__html:item.title.rendered}} />
                    <div className="blogContent" id={"content_"+item.id} dangerouslySetInnerHTML={{__html:item.excerpt.rendered}} />
                    <hr />
                </div>
            )

            )}
        </div>
    )
    }else{
        return <div>Loading blogs</div>
    }
}

export {BlogList}