# Customer Discovery Call Transcript

**Customer:** Fix Wireless
**Attendees:** Dana Reeves (Director of Operations), Marcus Brown (Regional Manager, Southeast), Sarah Kim (Franchise Owner, 3 locations)
**ServiceCentral Attendees:** [BA Name], Josh Muir (CCO)
**Date:** [Redacted]
**Duration:** 38 minutes
**Note:** This transcript has been lightly edited for readability. Some cross-talk removed.

---

**Josh:** Thanks for making time everyone. I'll hand over to [BA Name] who's going to walk through how you're using the system today and where the pain points are. [BA Name], over to you.

**[BA Name]:** Great, thanks Josh. So Dana, maybe start with the big picture, what does a typical day look like for your ops team?

**Dana:** Sure. So we have 62 locations across 14 states. My team's job is basically making sure every store is running efficiently, parts are flowing, and tickets aren't getting stuck. The biggest headache honestly is visibility. I open RepairQ every morning and I can see one store at a time. If I want to know how Atlanta is doing versus Dallas, I'm exporting CSVs from each location, pasting them into a spreadsheet, and by the time I've built the report it's already out of date.

**[BA Name]:** How long does that take you?

**Dana:** Couple hours? Maybe three if I'm being thorough. And I do it twice a week. My ops coordinator Janelle does it the other days.

**Marcus:** I just want to jump in, the issue for me is different. I don't need the big picture, I need to know right now which stores have tickets sitting more than 48 hours. That's my fire alarm. If a ticket's been open two days, something's wrong, either waiting on parts, or the tech dropped the ball, or the customer ghosted. I need to see that in real time, not in a Tuesday morning spreadsheet.

**Dana:** Right, but Marcus, the regional view is important too because-

**Marcus:** I'm not saying it's not, I'm saying for the day-to-day ops the turnaround time thing is what matters. When I was at Batteries Plus we had something similar and it was, I think it was just a dashboard that showed tickets by age bucket. Under 24 hours, 24 to 48, over 48. Color coded. Green, yellow, red. Simple.

**Dana:** OK but I also need parts visibility. That's actually probably more important than the turnaround thing if I'm being honest.

**[BA Name]:** Tell me more about the parts problem.

**Dana:** So each store manages their own parts inventory in RepairQ. Which is fine for them but I have no way to see across locations. Last month we had a store in Tampa that was sitting on 200 iPhone 15 screens while the store in Orlando, 90 minutes away, was turning customers away because they were out of stock. That's lost revenue. I need to see inventory across all locations and ideally get some kind of alert when there's an imbalance.

**Sarah:** Can I add something? I own three stores and I feel like I'm caught in the middle here. The stuff Dana's talking about is great for corporate, but what I need is simpler. When a customer drops off a device, I want them to get a text when the repair is done. That's it. We're losing Google reviews because people call to check on their phone and we're too busy to answer. If they just got an automatic update they wouldn't need to call.

**Marcus:** We actually have that turned on for some stores. It's in RepairQ settings.

**Sarah:** Wait, really? Nobody told us.

**Marcus:** Yeah, it's under notifications. I can show you after this call. But it's per-store, you have to set it up individually.

**Sarah:** OK well that's a different issue then. But also, the texts that go out, can they include an estimate? Like "your repair is estimated to be ready by 3pm Thursday"?

**[BA Name]:** That's interesting. Is estimated completion time something you track today?

**Marcus:** No. I mean the techs kind of know but it's not in the system. We have repair type and we know roughly how long a screen replacement takes versus a battery swap versus a water damage diagnostic. But there's no field for estimated completion.

**Dana:** Actually that would be huge. If we had estimated completion times and could compare that against actual completion, that's your turnaround efficiency metric right there. You could see which stores are fast, which are slow, which repair types take longer than expected.

**[BA Name]:** So let me play that back. You've got three themes: cross-location visibility on turnaround times, cross-location visibility on parts inventory, and customer notifications with time estimates. Which of those is highest priority if you could only pick one?

**Dana:** Parts inventory.

**Marcus:** Turnaround visibility, no question.

**Sarah:** Notifications.

*[Laughter]*

**Dana:** OK look, the notifications thing might actually be the easiest win. If we can reduce inbound calls by even 20%, that frees up the counter staff to actually process more repairs. But strategically, the parts visibility is what saves us the most money. We're probably losing $15,000-20,000 a month in lost repairs because of inventory imbalances.

**Marcus:** I'll concede the money point, but the turnaround dashboard is what my regional managers will actually use every day. The parts thing is a weekly or monthly analysis.

**[BA Name]:** Dana, when you say parts visibility, what would you actually want to do with that information? Just see it, or take action?

**Dana:** Both. I want to see a heat map or something showing which locations are overstocked and understocked on which parts. And then ideally I could create a transfer order, like "move 50 iPhone 15 screens from Tampa to Orlando." I don't know if your system supports transfer orders.

**Josh:** We don't have transfer orders in RepairQ today. That would be a new capability.

**Dana:** OK well even just the visibility would be a start. The transfer thing could be a phase two.

**Marcus:** One more thing. Whatever we build, it needs to work on mobile. I'm in my car half the day driving between stores. I'm not going to pull up a laptop to check a dashboard.

**Dana:** That's a good point. Mobile-friendly is important.

**Sarah:** And can we talk about the login situation? I have three stores and I have three separate RepairQ logins. It drives me crazy. Why can't I just log in once and switch between locations?

**Josh:** Yeah, that's a known limitation we're working on. Multi-location management is on our roadmap.

**Dana:** The other thing I keep forgetting, we need this to play nice with our Looker instance. We already have a bunch of financial reports in Looker and I don't want a completely separate reporting tool. If the data could flow into Looker that would be ideal.

**[BA Name]:** That's helpful context. So the data needs to be accessible for your existing BI setup, not just a standalone dashboard.

**Dana:** Exactly. I mean, a standalone thing is fine for the quick daily view, but the deeper analysis should feed into Looker.

**Marcus:** I'd honestly be fine with just the standalone dashboard. Looker is Dana's world, not mine.

**[BA Name]:** A couple more questions. How many repair tickets are you processing across all locations per month?

**Dana:** Roughly 8,000 to 10,000 give or take. Peaks in Q4 obviously, with holiday device sales leading to more repairs in January and February.

**[BA Name]:** And the parts catalog, how many unique SKUs?

**Dana:** Oh god, I don't know. Maybe 400? 500? It's a lot. Between different phone models, different repair types, OEM versus aftermarket parts. It's a lot.

**Marcus:** I'd say closer to 300 for the stuff that actually moves. There's a long tail of parts we stock one or two of.

**[BA Name]:** Great, this is really helpful. Let me take all of this away and put together some options. We'll come back with a prototype to show you what's possible and we can iterate from there.

**Dana:** That would be great. And I know I said parts visibility is the priority but honestly if you can show me something that covers the turnaround view and the parts view even at a basic level, that's what I want to see. I don't need it to be perfect.

**Marcus:** Just make sure the turnaround thing has the ticket aging buckets I mentioned. That's my daily driver.

**Sarah:** And if the notification thing is easy to turn on for my stores, can someone just help me with that separately? I don't want to hold up the bigger project.

**Josh:** Absolutely, we'll get that sorted for you this week Sarah.

**Dana:** Oh, one last thing. Security. Our franchise agreement with Fix Wireless corporate requires that any third-party tool accessing our data has SOC2 certification. Is ServiceCentral SOC2?

**Josh:** ServiceManager is SOC2 certified, yes. RepairQ's data sits on the same infrastructure.

**Dana:** OK good. Just making sure because our compliance team will ask.

**[BA Name]:** Perfect. Thanks everyone, really productive call. We'll have something to show you within a couple of weeks.

---

*[End of transcript]*
