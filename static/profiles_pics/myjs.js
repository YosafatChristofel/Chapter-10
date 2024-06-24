function get_posts(username) {
    if (username == undefined) {
        username = "";
    }
    $("#post-box").empty();
    $.ajax({
        type: "GET",
        url: `/get_posts?username_give=${username}`,
        data: {},
        success: function (response) {
            if (response["result"] === "success") {
                let posts = response["posts"];
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i];
                    let time_post = new Date(post["date"]);
                    let time_before = time2str(time_post);
                    let class_heart = post["heart_by_me"] ? "fa-heart" : "fa-heart-o";
                    let class_star = post["star_by_me"] ? "fa-star" : "fa-star-o";
                    let class_thumbsup = post["thumbsup_by_me"] ? "fa-thumbs-up" : "fa-thumbs-o-up";
                    let html_temp = `<div class="box" id="${post["_id"]}">
                                        <article class="media">
                                            <div class="media-left">
                                                <a class="image is-64x64" href="/user/${post["username"]}">
                                                    <img class="is-rounded" src="/static/${post["profile_pic_real"]}" alt="Image">
                                                </a>
                                            </div>
                                            <div class="media-content">
                                                <div class="content">
                                                    <p>
                                                        <strong>${post["profile_name"]}</strong> <small>@${post["username"]}</small> <small>${time_before}</small>
                                                        <br>
                                                        ${post["comment"]}
                                                    </p>
                                                </div>
                                                <nav class="level is-mobile">
                                                    <div class="level-left">
                                                        <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${post["_id"]}', 'heart')">
                                                            <span class="icon is-small"><i class="fa ${class_heart}" aria-hidden="true"></i></span>&nbsp;<span class="like-num">${num2str(post["count_heart"])}</span>
                                                        </a>
                                                        <a class="level-item is-sparta" aria-label="star" onclick="toggle_like('${post["_id"]}', 'star')">
                                                            <span class="icon is-small"><i class="fa ${class_star}" aria-hidden="true"></i></span>&nbsp;<span class="like-num">${num2str(post["count_star"])}</span>
                                                        </a>
                                                        <a class="level-item is-sparta" aria-label="thumbsup" onclick="toggle_like('${post["_id"]}', 'thumbsup')">
                                                            <span class="icon is-small"><i class="fa ${class_thumbsup}" aria-hidden="true"></i></span>&nbsp;<span class="like-num">${num2str(post["count_thumbsup"])}</span>
                                                        </a>
                                                    </div>
                                                </nav>
                                            </div>
                                        </article>
                                    </div>`;
                    $("#post-box").append(html_temp);
                }
            }
        },
    });
}

function toggle_like(post_id, type) {
    console.log(post_id, type);
    let $a_like = $(`#${post_id} a[aria-label='${type}']`);
    let $i_like = $a_like.find("i");
    let action = $i_like.hasClass(`fa-${type}`) ? "unlike" : "like";
    $.ajax({
        type: "POST",
        url: "/update_like",
        data: {
            post_id_give: post_id,
            type_give: type,
            action_give: action,
        },
        success: function (response) {
            if (action === "like") {
                $i_like.addClass(`fa-${type}`).removeClass(`fa-${type}-o`);
            } else {
                $i_like.addClass(`fa-${type}-o`).removeClass(`fa-${type}`);
            }
            $a_like.find("span.like-num").text(num2str(response["count"]));
        },
    });
}
