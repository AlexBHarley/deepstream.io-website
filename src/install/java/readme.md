---
title: deepstream Java SDK
description: Getting started with deepstream on Java
---

### Installing

#### Via Gradle

When using gradle, add this to your `build.gradle` file:

<pre><code>compile 'io.deepstream:deepstream.io-client-java:<span class="version"></span>'</code></pre>

#### Via Maven

When using maven, add this to your `pom.xml` file:

<pre><code>&lt;dependency&gt;
    &lt;groupId&gt;io.deepstream&lt;/groupId&gt;
    &lt;artifactId&gt;deepstream.io-client-java&lt;/artifactId&gt;
    &lt;version&gt;<span class="version"></span>&lt;/version&gt;
    &lt;type&gt;pom&lt;/type&gt;
&lt;/dependency&gt;
</code></pre>

#### Via Ivy

<pre><code>&lt;dependency org=&#39;io.deepstream&#39; name=&#39;deepstream.io-client-java&#39; rev=&#39;<span class="version"></span>&#39;&gt;
  &lt;artifact name=&#39;$AID&#39; ext=&#39;pom&#39;&gt;&lt;/artifact&gt;
&lt;/dependency&gt;
</code></pre>

<script type="text/javascript" src="/assets/js/java-versions.js"></script>

#### Via Bintray

Visit the package on [Bintray](https://bintray.com/deepstreamio/maven/deepstream.io-client-java) for details on release versions and dates

### Usage

You can setup a deepstream project as easily as:

Adding the dependency to your project:

```gradle
repositories {
    jcenter()
}

dependencies {
    compile 'io.deepstream:deepstream.io-client-java:0.8'
}
```

And requiring it within your application:

```java
import io.deepstream.DeepstreamClient;
import java.net.URISyntaxException;

public class Application {

    public static void main(String[] args) throws URISyntaxException {
        DeepstreamClient ds = new DeepstreamClient( "localhost:6021" );
        ds.login();
        ds.event.emit( "app", "My first ever event!" );
    }
}
```

For a deeper look into the Java package, take a look at our [quick start tutorial](../../tutorials/core/getting-started-java).