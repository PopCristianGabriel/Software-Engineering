import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManagePCComponent} from './components/manage-pc/manage-pc.component';
import {CreateConferenceComponent} from './components/create-conference/create-conference.component';
import {PcDetailComponent} from './components/pc-detail/pc-detail.component';
import {PcHomeComponent} from './components/pc-home/pc-home.component';
import {ChairHomeComponent} from './components/chair-home';
import {LoginComponent} from './components/login';
import {RegisterComponent} from './components/register/register.component';
import {AuthorRegisterComponent} from './components/author-register/author-register.component';
import {PcRegisterComponent} from './components/pc-register/pc-register.component';
import {UploadAbstractComponent} from './components/upload-abstract/upload-abstract.component';
import {AuthorPapersComponent} from './components/author-papers/author-papers.component';
import {PaperDetailComponent} from './components/paper-detail/paper-detail.component';
import {HomepageComponent} from './components/homepage/homepage.component';
import {AuthorHomeComponent} from './components/author-home/author-home.component';
import {AllReviewsComponent} from './components/all-reviews/all-reviews.component';
import {BiddingComponent} from './components/bidding/bidding.component';
import {BuyTicketComponent} from './components/buy-ticket/buy-ticket.component';
import {UpdateConferenceComponent} from './components/update-conference/update-conference.component';
import {StructureConferenceComponent} from './components/structure-conference/structure-conference.component';
import {PcReviewComponent} from './components/pc-review/pc-review.component';
import {RoomsComponent} from './components/rooms/rooms.component';
import {AssignReviewerComponent} from './components/assign-reviewer/assign-reviewer.component';
import {PaperDetailDecisionComponent} from './components/paper-detail-decision/paper-detail-decision.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {SuccessBuyComponent} from './components/success-buy/success-buy.component';
import {PaymentComponent} from './components/payment/payment.component';
import {ManageSessionComponent} from './components/manage-session/manage-session.component';
import {AuthGuard} from './helper';


const routes: Routes = [
  {path: 'pc/detail/:id', component: PcDetailComponent, canActivate: [AuthGuard]},
  {path: 'create-conference', component: CreateConferenceComponent, canActivate: [AuthGuard]},
  {path: 'manage-pcs', component: ManagePCComponent, canActivate: [AuthGuard]},
  {path: 'pc-home', component: PcHomeComponent, canActivate: [AuthGuard]},
  {path: 'author-home', component: AuthorHomeComponent, canActivate: [AuthGuard]},
  {path: 'reviews/all', component: AllReviewsComponent, canActivate: [AuthGuard]},
  {path: 'bid', component: BiddingComponent, canActivate: [AuthGuard]},
  {path: 'ticket', component: BuyTicketComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'pay/safe', component: PaymentComponent},
  {path: 'pay/end', component: SuccessBuyComponent},
  {path: 'conference/edit', component: UpdateConferenceComponent, canActivate: [AuthGuard]},
  {path: 'conference/structure', component: StructureConferenceComponent, canActivate: [AuthGuard]},
  {path: 'review/pc/:id', component: PcReviewComponent, canActivate: [AuthGuard]},
  {path: 'review/assign', component: AssignReviewerComponent, canActivate: [AuthGuard]},
  {path: 'rooms', component: RoomsComponent, canActivate: [AuthGuard]},
  {path: '', component: HomepageComponent},
  {path: 'chair-home', component: ChairHomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  // {path: 'register', component: RegisterComponent},
  {path: 'author-register', component: AuthorRegisterComponent},
  {path: 'pc-register', component: PcRegisterComponent},
  {path: 'paper/upload', component: UploadAbstractComponent, canActivate: [AuthGuard]},
  {path: 'paper/all', component: AuthorPapersComponent, canActivate: [AuthGuard]},
  {path: 'paper/detail/:id', component: PaperDetailComponent, canActivate: [AuthGuard]},
  {path: 'paper/decision/:id', component: PaperDetailDecisionComponent, canActivate: [AuthGuard]},
  {path: 'session/manage/:id', component: ManageSessionComponent, canActivate: [AuthGuard]},
  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
