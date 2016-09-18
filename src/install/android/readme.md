---
title: deepstream Android SDK
description: Getting started with deepstream on Android
---

### Installing

Add this to your applications `build.gradle` file:

<pre><code>compile 'io.deepstream:deepstream.io-client-java:<span class="version"></span>'</code></pre>

</code></pre>

<script type="text/javascript" src="/assets/js/java-versions.js"></script>

### Usage

You can setup a deepstream project as easily as:

Adding the dependency to your project:

```gradle
dependencies {
    compile 'io.deepstream:deepstream.io-client-java:0.8'
}
```

And requiring it within your application ( most of this code is android boiler plate! ):

```java
package deepstreamio.example.myapplication;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import io.deepstream.DeepstreamClient;

import java.net.URISyntaxException;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        try {
            DeepstreamClient ds = new DeepstreamClient( "localhost:6021" );
            ds.login();
            ds.event.emit( "app", "My first ever event!" );
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }
}
```

For a deeper look into the Java package, take a look at our [quick start tutorial](../../tutorials/core/getting-started-java).