I used maximum frequency as a method to compare ESM log likelihood scores to a Nextstrain tree.

In my slides I used these figures to describe maximum frequency:
<img
src="../Maximum%20Frequency/2e2beeec9ae8a54ae5f10136828449a430732729.png"
class="wikilink" alt="image-33.png" />
<img
src="../Maximum%20Frequency/b829fb45b1e922e14960544de00f4fe6709acc25.png"
class="wikilink" alt="image-34.png" />
I had them on separate slides which made it less clear they were connected.

Here's an image from one of Trevor's slides that highlights maximum frequency more clearly:
<img
src="../Maximum%20Frequency/0cb2934e8e83d7145a6353fc8504681954520fec.png"
class="wikilink" alt="image-32.png" />

At 2011, for 53N, some nodes on the tree would have a maximum frequency of 0.5.

Over time 53N is replace by a more dominate lineage, 278K that eventually reaches 100% maximum frequency, however for earlier nodes of 278K on the tree (2012-2014) maximum frequency is between 0 and 1.

# How this was done programmatically

## To get the maximum frequency of terminal node:

<figure>
<img
src="../Maximum%20Frequency/b6523c04d96a268fac7bf93f2f0663361568537f.png"
class="wikilink" alt="image-25.png" />
<figcaption aria-hidden="true">image-25.png</figcaption>
</figure>

Frequencies for terminal node (stored in a JSON file) for A/Norway/1824/2015:

``` json
      {
      0.003671,
      0.016207,
      6e-06,
      }
```

Shown in the JSON file are just frequencies for this node above 0% (there are zeros above and below these points indicating no samples were collected at that point in time).

If we wanted to get the maximum frequency for this node, we would select the highest frequency of all sampled strains for this node: 0.016207.

We can visualize these points on a Nextstrain tree if we turn off normalization for frequency:
<img
src="../Maximum%20Frequency/495ab18b066062ed3be1d27610792086848610c7.png"
class="wikilink" alt="image-24.png" />

## To get the maximum frequency of an internal node:

<figure>
<img
src="../Maximum%20Frequency/3a30ae7205d44a2494cb1fd21d84160f9842ea6f.png"
class="wikilink" alt="image-21.png" />
<figcaption aria-hidden="true">image-21.png</figcaption>
</figure>

If we normalize our frequencies in Nextstrain, clade 3C.3b would have a frequency of 100%, but we want to look at the frequency of this internal node across all other clades during this time period.

Nextstrain frequency normalization does not show us this:
<img
src="../Maximum%20Frequency/3689bd5d18730604a4efdaab6cba06a2fa41d2f4.png"
class="wikilink" alt="image-23.png" />

Like before we return to our JSON files including all children for the internal node:

Frequencies for terminal node: A/Norway/1824/2015:

``` json
      {
      0.003671,
      0.016207,
      6e-06,
      }
```

Frequencies for terminal node: A/SouthDakota/11/2015:

``` json
      {
      0.003443,
      0.016774,
      6e-06,
      }
```

To get maximum frequency of internal node we add frequencies in the same time period:

          {         
          0.003671 + 0.003443 = 0.007114
          0.016207 + 0.016774 = 0.032981
          6e-06    + 6e-06    = 0.000012
          }

And choose the highest value:

``` json
      {         
      0.007114,
      0.032981,
      0.000012,
      }
```

Maximum frequency is 0.032981 or 3% for the internal node.

This is viewable in Nextstrain with frequency normalization turned off:

Frequency normalization off:
<img
src="../Maximum%20Frequency/b4ec2d26708cadf0329bf59e3016020a25eb99c3.png"
class="wikilink" alt="image-22.png" />
In 2015 the internal node varied in frequency but reached a peak of 3%.

Using maximum frequency we can assume that a node with a high maximum frequency is more fit than a node with a lower maximum frequency at that given point in time. The "trunk" of our tree would be connected nodes over time that reach 100% maximum frequency.

The further we zoom out and the closer we get to the trunk of the tree we will see some nodes that reach 100% maximum frequency.

<img
src="../Maximum%20Frequency/92c2db5de0d31dfc41baff6a96fa227671acc24c.png"
class="wikilink" alt="image-28.png" />
<img
src="../Maximum%20Frequency/b9511a733447ac1bd773f297b1676fa51a89e0d1.png"
class="wikilink" alt="image-29.png" />

Clade 3C.3b is never the only circulating variant, and no nodes ever reach 100% frequency, reaching only a maximum frequency of 9% for some nodes at 2015.
<img
src="../Maximum%20Frequency/87be63cbd69cf4a6700d71c6dc29c74401f79b78.png"
class="wikilink" alt="image-30.png" />
<img
src="../Maximum%20Frequency/c0ece4220547b941377868432229bbb18bb87f80.png"
class="wikilink" alt="image-31.png" />

Maximum frequency was used as a comparison against deep mutational scanning, for Flu HA [in this paper](https://www.pnas.org/doi/10.1073/pnas.1806133115#fig04).
<img
src="../Maximum%20Frequency/16aaa3763d1d25bd9d0ea3e9d29f034c96e2452e.png"
class="wikilink" alt="image-26.png" />
<img
src="../Maximum%20Frequency/8a1763ed8be2c5f8bbb0afe21c18224626644cea.png"
class="wikilink" alt="image-27.png" />
