轮播图插件，可动态配置功能项：eg 左右按钮功能是否生效或显示、小圆点功能是否生效或显示

install:

```js
npm install rotation-chart
```

import:

```js
import { JJZSlider } from "rotation-chart";
```

or:

```js
import {
  JJZSlider,
  pluginController, // 小圆点插件
  pluginPrevious,   // 上一张按钮插件
  pluginNext,       // 下一张按钮插件
} from "rotation-chart";
```

options:

```js
JJZSlider(
    {
        container: 目标元素,
        images: 图片集合,
        style?: {width,height} 宽高,
        cycle?: 时间,
    }
)

```

usage:

```js
<div class="slider"></div>;

const container = document.querySelector(".slider");
const slider = new JJZSlider({ container, images });

//registerPlugins 注册安装插件
//在不需要某个功能时无须注册
slider.registerPlugins(pluginController, pluginPrevious, pluginNext);
```
# rotation-chart
