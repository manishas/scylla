# Scylla [![Build Status](https://travis-ci.org/simplymeasured/scylla.png?branch=master)](https://travis-ci.org/simplymeasured/scylla)

![The Scylla Mascot](https://rawgithub.com/simplymeasured/scylla/master/public/images/scylla.svg)

## Introduction
Scylla detects visual changes in web pages by capturing screenshots of webpages, comparing them and then alerting the user to the specific changes. It displays the visual changes in an easy-to-explore manner, which makes it accessible to all levels of technical ability.

### Developers
As a Developer, Scylla can serve as the first line of testing.
* Run it immediately after a change, and Scylla will allow you to immediately ensure that things changed as planned.
* Run after a refactor, it will allow you to be certain things remained the same.

### Quality and Operations
Quality and Ops’ focus on the end-user experience often means that they want to be notified immediately of anything that may negatively impact the user.
* The built-in scheduling lets you capture screens independent of builds, ensuring that even out-of-process changes don’t go unnoticed. (like third-party CDNs, generated content, etc)
* A simple API allows automated tools to generate new screenshots.


## Getting Started

### Capturing Screenshots
Scylla has two ways that you can capture and compare screenshots.

#### Reports
Reports allow you to track a single URL over time. After you create a report, Scylla will immediately capture a screenshot and set that initial screen as “Master.”  By pressing the “Run Report” icon next to the report name, Scylla will capture a new screenshot and compare it against the current master. Each screenshot is listed in the Report Details, and each comparison that includes the specific screenshot is listed next to it.  To set the new “Master,” click the star next to the date that screenshot was taken. The next screenshots will be compared against the current “Master.”

#### AB Compare
Compare allows you to track the differences between two separate URLs. This is great when trying to compare a local version to a server version of a site.

### Automating Reports
The real value of Scylla is its ability to automate the visual testing. By setting up a batch of reports, you can run multiple reports at once, and even schedule the reports to run in the morning.  If you add your email address as a “Watcher” on a batch, you’ll get a summary email after each scheduled run, a handy piece of news to greet you first thing in the morning.

### Visual Diffs
Scylla’s visual diff viewer let you compare screens in two ways.

#### Difference Overlay
Scylla generates an image with all pixels that have changed in red.  We overlay this image on top of the new screenshot so that you can quickly see exactly which pixels have changed.  By adjusting the slider on the top, you can change the intensity of the red change markers.

#### Swipe
Once you’ve found where the screens have changed, you can switch to swipe mode to focus on the exact changes. In the slider view, the older, “Master” image is on the left, while the newer screenshot is on the right.  The slider will adjust a vertical seam between the images, and is a great way to see tiny adjustments in height or color that would be impossible to notice without such a tool.

## Installation
Scylla comes with a vagrant script to make setting up a local server very simple.

1. Download archive or clone git URL
2. Install [Vagrant]
3. Optional: Configure SendGrid for sending emails.
    Copy mail-example.js to mail.js and add your sendgrid credentials.
3. type ‘vagrant up’ in the scylla directory
4. Done! Scylla is now running at: http://localhost:8090/

## APIs
Scylla is built on a simple HTTP API, which allows simple integration with scripts and other services. We're still trying to figure out if this API is useful, feel free to comment and watch on the [Doc Bug](https://github.com/simplymeasured/scylla/issues/17).

## Behind the Curtain
Scylla was developed by [Simply Measured][sm].

## Name
Scylla is a part of Greek Mythology, originally a beautiful daughter of a God, but turned into a sea monster.

She has 12 tentacles and is known to sit high up on a cliff and wait for sailors to sail close enough so that she
can snatch them up or throw boulders down on top of them. She works in tandem with Charybdis.

## Links

* Home: http://getscylla.com
* Source: https://github.com/simplymeasured/scylla
* Builds: https://travis-ci.org/simplymeasured/scylla
* Issues: https://github.com/simplymeasured/scylla/issues
* Mailing List: https://groups.google.com/forum/#!forum/scylla-users
* Chat: irc:chat.freenode.net#scylla

# License
See [LICENSE][license].

[sm]: http://simplymeasured.com
[vagrant]: http://vagrantup.com
[license]: https://github.com/simplymeasured/scylla/blob/master/LICENSE.md
